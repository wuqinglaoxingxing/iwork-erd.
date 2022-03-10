<template>
    <div>
        <!-- <div id="js_add-field">11111</div> -->
        <div class="lFow" :id="id"></div>
        <div class="lFow-oprt-wrapper">
            <ul class="oprt-items">
                <li @click="importFile">
                    <i class="icon iconfont icon-dakaiwenjian"></i>
                </li>
            </ul>
            <ul class="oprt-items">
                <li @click="save('json')">
                    <i class="icon iconfont icon-json-full"></i>
                </li>
                <li @click="save('xml')">
                    <i class="icon iconfont icon-xml"></i>
                </li>
                <li @click="save('png')">
                    <i class="icon iconfont icon-xiazaitupian"></i>
                </li>
            </ul>
        </div>
    </div>

</template>

<script>
import LogicFlow from "@logicflow/core";
import { Snapshot, lfJson2Xml} from "@logicflow/extension";
import { XMLParser} from "fast-xml-parser";
import "@logicflow/core/dist/style/index.css";
import _ from "lodash";
import "./sqlNode/index.css";
import sqlNode from "./sqlNode/index";
import xhtml from "@/service/xhtml";

export default {
    name: "graphContent",
    props: ["link_data", "dataTypeDomains"],
    data() {
        return {
            nodes: [],
            edges: [],
            entities: [],
            // 默认生成格式
            downType: "json", //json,xml,png
        };
    },
    computed: {
        id: function () {
            return this.link_data.id;
        },
        // 默认数据库
        defaultDatabase() {
            const { database } = this.dataTypeDomains;
            return database.find((db) => {
                return db.defaultDatabase;
            });
        },
    },
    created() {
        const { datas } = this.link_data;
        this.nodes = _.cloneDeep(datas.value.nodes);
        this.edges = _.cloneDeep(datas.value.edges);
        this.entities = _.cloneDeep(datas.value.entities);
        // 将node转化为需要的格式
        this.nodesHandle();
    },
    mounted() {
        // 使用图片中间件
        LogicFlow.use(Snapshot);
        // 创建一个实例
        this.lf = new LogicFlow({
            container: document.querySelector(`#${this.id}.lFow`),
            grid: true, //网格，若设为false不开启
            keyboard: {
                enabled: true, //开启默认快捷键
                // 自定义删除快捷键
                shortcuts: [
                    {
                        keys: ["backspace"],
                        callback: () => {
                            this.confirm("温馨提示", "确定要删除吗？", () => {
                                const elements = this.lf.getSelectElements(true);
                                this.lf.clearSelectElements();
                                elements.edges.forEach((edge) =>
                                    this.lf.deleteEdge(edge.id)
                                );
                                elements.nodes.forEach((node) =>
                                    this.lf.deleteNode(node.id)
                                );
                            });
                        },
                    },
                    {
                        // 保存文件
                        keys: ["command+s", "ctrl+s"],
                        callback: (e) => {
                            e.preventDefault();
                            this.save(this.downType);
                        },
                    },
                    {
                        // 导入文件
                        keys: ["command+i", "ctrl+i"],
                        callback: (e) => {
                            e.preventDefault();
                            this.import();
                        },
                    },
                ],
            },
        });
        // 注册sql节点
        this.lf.register(sqlNode);
        // 修改默认边的类型 bezier
        this.lf.setDefaultEdgeType("polyline");
        // 设置主题
        this.lf.setTheme({
            polyline: {
                stroke: "#afafaf",
                strokeWidth: 1,
            },
        });
        this.lf.render({
            nodes: this.nodes,
            edges: [],
        });

        this.lf.on("connection:not-allowed", (msg) => {
            console.log(msg);
        });
    },
    methods: {
        nodesHandle() {
            const { datatype } = this.dataTypeDomains;

            this.nodes.forEach((node) => {
                const et = this.entities.find((et) => et.title == node.title);
                if (et) {
                    const fields = et.fields;
                    const tblEt = fields.map((field) => {
                        const dataItem = datatype.find((dataItem) => {
                            return dataItem.code === field.type;
                        });
                        return {
                            key: field.name,
                            type:
                                dataItem?.apply[this?.defaultDatabase?.code]
                                    ?.type || "",
                        };
                    });
                    this.$set(node, "properties", {
                        tableName: node.title,
                        fields: tblEt,
                    });
                }
            });
        },
        save(type) {
            switch (type) {
                case "json":
                    const json = this.lf.getGraphData();
                    this.downFile(
                        JSON.stringify(json),
                        "1.json",
                        "application/json"
                    );
                    break;
                case "xml":
                    const xml = lfJson2Xml(this.lf.getGraphData());
                    this.downFile(xml, "1.xml", "text/xml");
                    break;
                case "png":
                    this.lf.getSnapshot();
                    break;
            }
        },
        // 下载文件
        downFile(data, filename, type) {
            const a = document.createElement("a");
            // 转化blob
            const blob = new Blob([data], { type });
            // FileReader主要用于将文件内容读入内存
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            // onload当读取操作成功完成时调用
            reader.onload = function (e) {
                // 获取文件名fileName
                a.href = e.target.result;
                // 设置名称
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
        },
        importFile() {
            const self = this;
            // 设置导入文件dom
            const importFile = document.querySelector("#importFile");
            // 设置传输格式
            importFile.setAttribute("accept","text/xml,application/json")
            // 文件选择事件
            let changeFn = function () {
                let file = this.files[0];
                if (file) {
                    const reader = new FileReader(); //这是核心,读取操作就是由它完成.
                    reader.readAsText(file); //读取文件的内容,也可以读取文件的URL
                    reader.onload = function() {
                        //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
                        let result = this.result
                        if(file.type.endsWith("xml")){
                            const parser = new XMLParser();
                            result = parser.parse(result);
                            self.lf.render(result);
                        }else{
                            self.lf.render(JSON.parse(result));
                        }
                    }
                }
            };
            importFile.addEventListener("change", changeFn, false);
            // 触发click事件
            importFile.click();
        },
        //  document
        //     .querySelector("#js_add-field")
        //     .addEventListener("click", () => {
        //         lf.getNodeModelById("node_id_1").addField({
        //             key: Math.random().toString(36).substring(2, 7),
        //             type: ["integer", "long", "string", "boolean"][
        //                 Math.floor(Math.random() * 4)
        //             ],
        //         });
        //     });
    },
};
</script>

<style lang="scss" scoped>
.lFow {
    height: calc(100vh - 141px);
}
.lFow-oprt-wrapper {
    position: fixed;
    bottom: 0.1rem;
    .oprt-items {
        display: inline-flex;
        background-color: #e5e5e5;
        li {
            margin: 0.1rem;
            vertical-align: middle;
            position: relative;
            cursor: pointer;
            i {
                display: inline-flex;
                font-size: 20px;
                align-items: center;
                justify-content: center;
                color: #555555;
            }
            &:not(:last-child):after {
                content: "";
                display: inline-block;
                position: absolute;
                right: -10px;
                top: 4px;
                width: 0;
                height: 16px;
                border: 1px #bbb solid;
            }
        }
    }
}
</style>
