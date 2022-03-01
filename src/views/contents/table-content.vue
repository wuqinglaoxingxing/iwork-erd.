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
                    aaa
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
    props: ["link_data"],
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
    },
    data() {
        return {
            // 表格信息
            tableInfo: {},
            // tabActive
            tabActiveIndex:1
            
        };
    },

    created() {},
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
        }
    }
}
</style>