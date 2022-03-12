<template>
    <div class="data-table">
        <div class="table-title">
            <i class="icon iconfont icon-biaodanzujian-biaoge"></i>
            {{title}}
        </div>
        <div class="table-content-wrapper">
            <div class="table-content-tabs">
                <ul class="content-tabs">
                    <li @click="tabActiveIndex=0" :class="{'active':tabActiveIndex===0}">基本信息</li>
                    <li @click="tabActiveIndex=1" :class="{'active':tabActiveIndex===1}">字段信息</li>
                    <li @click="tabActiveIndex=2" :class="{'active':tabActiveIndex===2}">代码信息</li>
                    <li @click="tabActiveIndex=3" :class="{'active':tabActiveIndex===3}">索引信息</li>
                </ul>
            </div>
            <div class="table-content">
                <div class="basicInfo animate__animated animate__fadeIn" v-show="tabActiveIndex===0">
                    <ul>
                        <li>
                            <label>表名</label>
                            <div>
                                <input autocomplete="off" v-model="tableInfo.datas.value.chnname" type="text"
                                    name="tableNm">
                            </div>
                        </li>
                        <li>
                            <label>逻辑名</label>
                            <div>
                                <input disabled v-model="tableInfo.datas.value.title" type="text" name="tableNm">
                            </div>
                        </li>
                        <li>
                            <label>说明</label>
                            <div>
                                <textarea v-model="tableInfo.datas.value.remark"></textarea>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="colInfo animate__animated animate__fadeIn" v-show="tabActiveIndex===1">
                    <div class="col-oprt">
                        <ul>
                            <li @click="colOprtFn('up')">
                                <i class="icon iconfont icon-xiangshangjiantoucuxiao"></i>
                            </li>
                            <li @click="colOprtFn('down')">
                                <i class="icon iconfont icon-xiangxiajiantoucuxiao"></i>
                            </li>
                            <li @click="colOprtFn('sub')">
                                <i class="icon iconfont icon-jian"></i>
                            </li>
                            <li @click="colOprtFn('add')">
                                <i class="icon iconfont icon-jiajianzujianjiahao"></i>
                            </li>
                        </ul>
                    </div>
                    <div class="table-wrapper">
                        <table>
                            <thead>
                                <th>序号</th>
                                <th v-for="header in tableHeader" :key="header.fieldName">
                                    {{header.desc}}
                                </th>
                            </thead>
                            <tbody>
                                <tr v-for="(field,idx) in tableContent" :key="field.id" @click="activeRow=idx"
                                    :class="{'active':activeRow==idx}">
                                    <td>{{idx+1}}</td>
                                    <td v-for="header in tableHeader" :key="header.id">
                                        <div v-if="header.typeShow=='text'">
                                            {{field[header.fieldName]}}
                                        </div>
                                        <div v-else-if="header.typeShow=='input'">
                                            <input type="text" v-model="field[header.fieldName]">
                                        </div>
                                        <div v-else-if="header.typeShow=='select'">
                                            <select v-model="field[header.fieldName]">
                                                <option v-for="(option,idx) in list[header.fieldName]" :key="idx"
                                                    :value="option.code">
                                                    {{option.name}}
                                                </option>
                                            </select>
                                        </div>
                                        <div v-else-if="header.typeShow=='textarea'" class="textarea">
                                            <input type="text" v-model="field[header.fieldName]">
                                            <div class="detail" @click="openTableColRemark(field,header.fieldName)">
                                                <i class="icon iconfont icon-shenglvehao"></i>
                                            </div>
                                        </div>
                                        <div v-else-if="header.typeShow=='checkbox'">
                                            <input type="checkbox" v-model="field[header.fieldName]">
                                        </div>
                                        <div v-else-if="header.typeShow=='eye'">
                                            <i class="icon iconfont" :class="{'icon-eye-fill':!field[header.fieldName],
                                                'icon-eyeclose-fill':field[header.fieldName]}"
                                                @click="field[header.fieldName]=!field[header.fieldName]"></i>

                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="codeInfo animate__animated animate__fadeIn" v-if="tabActiveIndex===2">
                    <ul class="codeInfo-tabs-db">
                        <li @click="codeInfoActiveCode=database.code" v-for="database in dataTypeDomains.database"
                            :key="database.code" :class="{'active':codeInfoActiveCode===database.code}">
                            {{database.code}}
                        </li>
                    </ul>
                    <ul class="codeInfo-tabs-tmp">
                        <li v-for="descSeq in codeDescSeq"
                            @click="codeInfoActiveTmp=descSeq"
                            :key="descSeq" :class="{'active':codeInfoActiveTmp===descSeq}">
                            {{codeDesc[descSeq]}}
                        </li>
                    </ul>
                    <!-- todo -->
                    <wscode :data="codeTemp"></wscode>
                </div>
            </div>
        </div>
        <div class="table-oprt">
            <div class='btlist'>
                <input type="button" class='btn_thired_s' value="保存" @click="save">
            </div>
        </div>
        <!-- {{tableInfo.datas.value}} -->
    </div>
</template>

<script>
import _ from "lodash";
import wscode from "@/components/wscode";
export default {
    name: "tableContent",
    props: ["link_data", "dataTypeDomains"],
    components: {
        wscode,
    },
    watch: {
        typeList: {
            handler(n, o) {
                const newV = _.cloneDeep(n);
                // 处理数据
                this.list.type = newV;
            },
            immediate: true,
            deep: true,
        },
        tableInfo: {
            handler(n, o) {
                const { datas: nD, id: nId, name: nName } = n;
                const { datas: oD, id: oId, name: oName } = this.orgTableInfo;
                // 更新标志
                const isUp =
                    JSON.stringify(nD) === JSON.stringify(oD) &&
                    oId === nId &&
                    nName === oName;
                if (!isUp) {
                    this.$emit("upNavState", { id: n.id, up: true });
                } else {
                    this.$emit("upNavState", { id: n.id, up: false });
                }
            },
            deep: true,
        },
    },

    computed: {
        title() {
            const {
                scope,
                value: { title },
            } = this.tableInfo.datas;
            const val = [scope, title, "数据表详情"];
            return val.join("/");
        },
        // 字段信息表格头部
        tableHeader() {
            const tblHeader = [
                {
                    id: 1,
                    desc: "字段名",
                    typeShow: "input",
                },
                {
                    id: 2,
                    desc: "逻辑名",
                    typeShow: "input",
                },
                {
                    id: 3,
                    desc: "类型",
                    typeShow: "select",
                },
                {
                    id: 4,
                    desc: "说明",
                    typeShow: "textarea",
                },
                {
                    id: 5,
                    desc: "主键",
                    typeShow: "checkbox",
                },
                {
                    id: 6,
                    desc: "关系图",
                    typeShow: "eye",
                },
                {
                    id: 7,
                    desc: "数据库类型",
                    typeShow: "text",
                },
                {
                    id: 8,
                    desc: "非空",
                    typeShow: "checkbox",
                },
                {
                    id: 9,
                    desc: "自增",
                    typeShow: "checkbox",
                },
                {
                    id: 10,
                    desc: "默认值",
                    typeShow: "input",
                },
                {
                    id: 11,
                    desc: "UI建议",
                    typeShow: "select",
                },
            ];
            const header = _.cloneDeep(this.tableInfo.datas.value.headers);
            header.push({
                fieldName: "uiAdvice",
                ationNoShow: true,
            });
            header.forEach((h, i) => {
                if (!h.relationNoShow) {
                    this.$set(h, "relationNoShow", false);
                }
                if (!h.pk) {
                    this.$set(h, "pk", false);
                }
                Object.assign(h, tblHeader[i]);
            });
            return header;
        },
        // 数据类型集合
        //下拉数据
        typeList() {
            const { datatype } = this.dataTypeDomains;
            return _.cloneDeep(datatype);
        },
        // 默认数据库
        defaultDatabase() {
            const { database } = this.dataTypeDomains;
            return database.find((db) => {
                return db.defaultDatabase;
            });
        },
        codeTemp(){
            const { database } = this.dataTypeDomains;
            const db = database.find(db=>this.codeInfoActiveCode===db.code)
            return db[this.codeInfoActiveTmp]||''
        }
    },
    data() {
        return {
            // 表格信息
            tableInfo: {},
            // 表格内容
            tableContent: [],
            // tabActive
            tabActiveIndex: 0,
            // 下拉
            list: {
                type: [],
                uiAdvice: [
                    { code: "NONE", name: "--请选择--" },
                    { code: "Text", name: "文字" },
                    { code: "Number", name: "数字" },
                    { code: "Money", name: "金额" },
                    { code: "Select", name: "下拉框" },
                    { code: "Radio", name: "单选" },
                    { code: "CheckBox", name: "多选" },
                    { code: "Email", name: "邮件" },
                    { code: "URL", name: "URL" },
                    { code: "DatePicker", name: "日期选择器" },
                    { code: "TextArea", name: "大文本" },
                    { code: "AddressPicker", name: "地址" },
                ],
            },
            //激活行
            activeRow: NaN,
            // 字段新增模板
            colTemplate: {
                chnname: "",
                dataType: "VARCHAR(32)",
                name: "untitled",
                pk: false,
                relationNoShow: false,
                remark: "",
                type: "DefaultString",
                uiAdvice: "NONE",
            },
            // 默认激活数据库
            codeInfoActiveCode: "",
            codeInfoActiveTmp:"createTableTemplate",
            // 代码描述
            codeDescSeq: [
                "createTableTemplate",
                "deleteTableTemplate",
                "createIndexTemplate",
                "deleteIndexTemplate",
                "rebuildTableTemplate",
                "createFieldTemplate",
                "deleteFieldTemplate",
                "updateFieldTemplate",
            ],
            codeDesc: {
                createTableTemplate: "新建数据表代码",
                deleteTableTemplate: "删除数据表代码",
                createIndexTemplate: "新建索引代码",
                deleteIndexTemplate: "删除索引代码",
                rebuildTableTemplate: "重建数据表代码",
                createFieldTemplate: "新建字段代码",
                deleteFieldTemplate: "删除字段代码",
                updateFieldTemplate: "修改字段代码",
            },
        };
    },

    created() {
        // 处理数据集合
        this.tableInfo = _.cloneDeep(this.link_data);

        // 数据类型对象
        // 表格数据
        this.tableContent = this.setTableContent();

        // 设置默认数据库为激活页签
        this.codeInfoActiveCode = this.defaultDatabase?.code;

        // 设置初始化传输数据用于比较
        this.orgTableInfo = _.cloneDeep(this.tableInfo);
    },

    methods: {
        // 设置表格数据
        setTableContent() {
            let fields = this.tableInfo.datas.value.fields;
            fields.forEach((f, idx) => {
                this.$set(f, "id", idx);
                if (!f.relationNoShow) {
                    this.$set(f, "relationNoShow", false);
                }
                if (!f.pk) {
                    this.$set(f, "pk", false);
                }
                // 设置类型
                f.dataType = this.getRowDataType(f);
                // 设置type默认值
                f.type = f.type || "NONE";
                // 设置ui设计默认值
                f.uiAdvice = f.uiAdvice || "NONE";
            });
            return fields;
        },
        // 获取row dataType
        getRowDataType(row) {
            const dataItem = this.typeList.find((dataItem) => {
                return dataItem.code === row.type;
            });
            return dataItem?.apply[this?.defaultDatabase?.code]?.type || "";
        },
        // 打开表字段说明
        openTableColRemark(field, col) {
            const value = field[col] || "";
            this.$store.commit("openDialog", {
                id: "tableColRemark",
                initdata: value,
                callback: (reVal) => {
                    field[col] = reVal || value;
                },
                noShade: false,
            });
        },
        // 表字段操作
        colOprtFn(act) {
            const fields = this.tableContent;
            if (act === "up") {
                // 向上
                if (isNaN(this.activeRow)) {
                    this.toast("info", "提示", "请选择移动字段");
                } else {
                    if (this.activeRow !== 0) {
                        const optRow = _.cloneDeep(fields[this.activeRow]);
                        fields.splice(this.activeRow, 1);
                        this.activeRow = this.activeRow - 1;
                        fields.splice(this.activeRow, 0, optRow);
                    } else {
                        this.toast("info", "提示", "移动字段已经处于最上层");
                    }
                }
            } else if (act === "down") {
                // 向下
                if (isNaN(this.activeRow)) {
                    this.toast("info", "提示", "请选择移动字段");
                } else {
                    if (this.activeRow !== fields.length - 1) {
                        const optRow = _.cloneDeep(fields[this.activeRow]);
                        fields.splice(this.activeRow, 1);
                        this.activeRow = this.activeRow + 1;
                        fields.splice(this.activeRow, 0, optRow);
                    } else {
                        this.toast("info", "提示", "移动字段已经处于最下层");
                    }
                }
            } else if (act === "sub") {
                // 针对删除-- 如果activeRow为NaN提示
                if (isNaN(this.activeRow)) {
                    this.toast("info", "提示", "请选择删除字段");
                } else {
                    fields.splice(this.activeRow, 1);
                    if (fields.length - 1 < this.activeRow) {
                        this.activeRow = NaN;
                    }
                }
            } else if (act === "add") {
                // 针对新增-- 如果activeRow为NaN,直接在最后添加,否则在其后添加
                const temp = _.cloneDeep(this.colTemplate);
                if (isNaN(this.activeRow)) {
                    fields.push(temp);
                } else {
                    fields.splice(this.activeRow + 1, 0, temp);
                }
            }
        },
        //保存
        save() {
            this.$emit("upView", {
                id: this.tableInfo.id,
                info: _.cloneDeep(this.tableInfo),
            });
            this.orgTableInfo = _.cloneDeep(this.tableInfo);
        },
    },
};
</script>

<style lang="scss" scoped>
input:disabled {
    background-color: #eee;
}
.data-table {
    color: #555;
    user-select: none;
    .table-title {
        font-size: 14px;
        height: 0.3rem;
        line-height: 0.3rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .table-content-wrapper {
        .table-content-tabs {
            .content-tabs {
                display: flex;
                flex-direction: row;
                height: 0.26rem;
                line-height: 0.26rem;
                border-top: 1px solid #111;
                border-bottom: 1px solid #111;
                li {
                    background-color: #ccc;
                    border-right: 2px #aaa solid;
                    padding: 0 0.1rem;
                    font-size: 14px;
                    cursor: pointer;
                    &.active {
                        background-color: #fff;
                    }
                }
            }
        }
        .table-content {
            .basicInfo {
                ul {
                    margin-top: 0.2rem;
                    li {
                        display: flex;
                        margin-top: 0.1rem;
                        font-size: 14px;
                        min-height: 0.3rem;
                        line-height: 0.3rem;
                        label {
                            text-align: right;
                            padding-right: 0.1rem;
                            width: 20%;
                        }
                        div {
                            flex: 1;
                            input {
                                width: 90%;
                                height: 0.24rem;
                            }

                            textarea {
                                height: 1rem;
                                resize: vertical;
                            }
                            input,
                            textarea {
                                color: #555;
                                font-size: 14px;
                                width: 90%;
                                text-indent: 3px;
                                border: 1px solid#ccc;
                                outline: none;
                                font-family: sans-serif;
                            }
                            input::-webkit-input-placeholder,
                            textarea::-webkit-input-placeholder {
                                font-family: sans-serif;
                            }

                            input:focus,
                            .textarea:focus {
                                border: 1px solid #5595e9;
                            }
                        }
                    }
                }
            }
            .colInfo {
                .col-oprt {
                    ul {
                        display: flex;
                        border: 1px solid #ccc;
                        margin: 0.05rem 0;
                        li {
                            height: 0.25rem;
                            width: 0.3rem;
                            line-height: 0.25rem;
                            text-align: center;
                            &:hover {
                                background-color: #ccc;
                                color: #fff;
                            }
                        }
                    }
                }
                .table-wrapper {
                    width: 100%;
                    overflow: auto;
                    table {
                        width: 100%;
                        border: 1px solid #ccc;
                        th {
                            font-size: 14px;
                            white-space: nowrap;
                            border: 1px solid #ccc;
                            text-align: center;
                            padding: 0.05rem 0.1rem;
                            height: 0.25rem;
                            line-height: 0.25rem;
                        }
                        tr:hover {
                            background-color: #f1f4fa;
                        }
                        tr.active {
                            background-color: #d0ddf4;
                        }
                        td {
                            color: #666;
                            border: 1px solid #ccc;
                            height: 0.25rem;
                            padding: 3px 5px;
                            font-size: 14px;
                            line-height: 0.25rem;
                            white-space: nowrap;
                            text-align: center;
                            & > div {
                                input[type="text"],
                                select,
                                textarea {
                                    border: 1px solid #ccc;
                                    height: 0.25rem;
                                    color: inherit;
                                    text-indent: 3px;
                                }
                                &.textarea {
                                    display: flex;
                                    & > div.detail {
                                        height: 0.25rem;
                                        border: 1px solid #ccc;
                                        margin-left: 1px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .codeInfo {
                .codeInfo-tabs-db,.codeInfo-tabs-tmp {
                    margin-top: 0.12rem;
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: row;
                    height: 0.28rem;
                    line-height: 0.26rem;
                    border-top: 1px solid #111;
                    border-bottom: 1px solid #111;
                    li {
                        background-color: #ccc;
                        border-right: 2px #aaa solid;
                        padding: 0 0.1rem;
                        white-space: nowrap;
                        font-size: 12px;
                        cursor: pointer;
                        &.active {
                            background-color: #fff;
                        }
                    }
                }
            }
        }
    }
    .table-oprt {
        .btlist {
            text-align: center;
            margin-top: 0.1rem;
        }
    }
}
</style>