<template>
    <div>
        <!-- <div id="js_add-field">11111</div> -->
        <div class="lFow" :id="id"></div>
    </div>

</template>

<script>
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";
import _ from "lodash";
import "./sqlNode/index.css";
import sqlNode from "./sqlNode/index";
export default {
    name: "graphContent",
    props: ["link_data", "dataTypeDomains"],
    data() {
        return {
            nodes: [],
            edges: [],
            entities: [],
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
        // 创建一个实例
        const lf = new LogicFlow({
            container: document.querySelector(`#${this.id}.lFow`),
            grid: true, //网格，若设为false不开启
            keyboard: {
                enabled: true, //开启默认快捷键
                // 自定义删除快捷键
                shortcuts: [
                    {
                        keys: ["backspace"],
                        callback: () => {
                            console.log(this);
                            this.confirm("温馨提示", "确定要删除吗？", () => {
                                const elements = lf.getSelectElements(true);
                                lf.clearSelectElements();
                                elements.edges.forEach((edge) =>
                                    lf.deleteEdge(edge.id)
                                );
                                elements.nodes.forEach((node) =>
                                    lf.deleteNode(node.id)
                                );
                            });
                        },
                    },
                ],
            },
        });
        // 注册sql节点
        lf.register(sqlNode);
        // 修改默认边的类型 bezier
        lf.setDefaultEdgeType("polyline");
        // 设置主题
        lf.setTheme({
            polyline: {
                stroke: "#afafaf",
                strokeWidth: 1,
            },
        });
        lf.render({
            nodes: this.nodes,
            edges: [],
        });

        lf.on("connection:not-allowed", (msg) => {
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
</style>
