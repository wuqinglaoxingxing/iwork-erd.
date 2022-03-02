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
                                <input v-model="tableInfo.datas.value.chnname" type="text" name="tableNm">
                            </div>
                        </li>
                        <li>
                            <label>逻辑名</label>
                            <div>
                                <input v-model="tableInfo.datas.value.title" type="text" name="tableNm">
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
                            <li>
                                <i class="icon iconfont icon-xiangshangjiantoucuxiao"></i>
                            </li>
                            <li>
                                <i class="icon iconfont icon-xiangxiajiantoucuxiao"></i>
                            </li>
                            <li>
                                <i class="icon iconfont icon-jian"></i>
                            </li>
                            <li>
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
                                <tr v-for="(field,idx) in tableContent" :key="field.id">
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
                                            <div class="detail">
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
                <div class="codeInfo animate__animated animate__fadeIn" v-show="tabActiveIndex===2"></div>
                <div class="indexInfo animate__animated animate__fadeIn" v-show="tabActiveIndex===3"></div>
            </div>
        </div>
        <!-- {{tableInfo.datas.value}} -->
    </div>
</template>

<script>
import _ from "lodash";
export default {
    name:"tableContent",
    props: ["link_data", "dataTypeDomains"],
    watch: {
        link_data: {
            handler(n, o) {
                const newV = _.cloneDeep(n);
                // 处理数据
                this.tableInfo = newV;
            },
            immediate: true,
            deep: true,
        },
        typeList: {
            handler(n, o) {
                const newV = _.cloneDeep(n);
                // 处理数据
                this.list.type = newV;
            },
            immediate: true,
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
        // 数据类型对象
        // 表格数据
        tableContent() {
            let fields = this.tableInfo.datas.value.fields;
            fields = fields.map((f, idx) => {
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
                f.type = f.type || 'NONE'
                // 设置ui设计默认值
                f.uiAdvice = f.uiAdvice || 'NONE'
                return f;
            });
            return fields;
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
    },
    data() {
        return {
            // 表格信息
            tableInfo: {},
            // tabActive
            tabActiveIndex: 1,
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
        };
    },

    created() {
        console.log(this.dataTypeDomains);
        console.log(this.link_data);
    },

    methods: {
        // 获取row dataType
        getRowDataType(row) {
            const dataItem = this.typeList.find((dataItem) => {
                return dataItem.code === row.type;
            });
            return dataItem?.apply[this?.defaultDatabase?.code]?.type || "";
        },
    },
};
</script>

<style lang="scss" scoped>
.data-table {
    color: #555;
    user-select: none;
    .table-title {
        font-size: 14px;
        height: 0.3rem;
        line-height: 0.3rem;
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
        }
    }
}
</style>