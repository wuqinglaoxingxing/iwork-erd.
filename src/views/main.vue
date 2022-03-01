<template>
    <div class="main">
        <div class="main-header">
            <div class="main-header-save">
                <i class="icon iconfont icon-save" style="color:#5988C9;"></i>
                <span>保存</span>
            </div>
            <div class="main-header-menu">
                <div class="main-header-menu-header">
                    <div class="left">
                        <span v-for="(item,idx) in HMHeaderList" :key="idx" @click="HMHeaderActiveId=item.id"
                            :class="{'active':HMHeaderActiveId===item.id}">{{item.desc}}</span>
                    </div>
                    <div class="right" @click="backToHome" title="返回首页">
                        <i class="icon iconfont icon-tuichu"></i>
                    </div>

                </div>
                <div class="main-header-menu-content">
                    <ul class="main-header-menu-content-item">
                        <ul class="main-header-menu-content-item-list">
                            <li>
                                <i class="icon iconfont icon-file-open" style="color:#F7CD58"></i>
                                <span>打开</span>
                            </li>
                            <li>
                                <i class="icon iconfont icon-addfolder" style="color:#9FBE86"></i>
                                <span>新建</span>
                            </li>
                            <li>
                                <i class="icon iconfont icon-quanbubaocungongzuobiao" style="color:#9192C9"></i>
                                <span>另存为</span>
                            </li>
                        </ul>
                        <li class="main-header-menu-content-item-desc">项目</li>
                    </ul>
                    <ul class="main-header-menu-content-item">
                        <ul class="main-header-menu-content-item-list">
                            <li>
                                <i class="icon iconfont icon-shezhi"></i>
                                <span>设置</span>
                            </li>
                            <li>
                                <i class="icon iconfont icon-shujukulianjie"></i>
                                <span>数据库连接</span>
                            </li>
                        </ul>
                        <li class="main-header-menu-content-item-desc">配置</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="main-content-container">
            <div class="main-content-left-tab" :class="{'close':!closeOrOpenShow}">
                <div class="left-tab-header">
                    <div class="left-tab-header-icons">
                        <i class="icon iconfont icon-xiangzuo pointer" :class="{'fanzhuan':!closeOrOpenShow}"
                            @click="closeOrOpenShow=!closeOrOpenShow"></i>
                        <i class="icon iconfont icon-shuaxin1 pointer"></i>
                    </div>
                    <div class="left-tab-header-names" :class="{'hidden':!closeOrOpenShow}">
                        <div class="name-title pointer" :class="{'active':tabNameActive===1}" @click="tabNameActive=1">
                            <i class="icon iconfont icon-shuju_biao">&nbsp;数据表</i>
                        </div>
                        <div class="name-title pointer" :class="{'active':tabNameActive===2}" @click="tabNameActive=2">
                            <i class="icon iconfont icon-shujuyu">&nbsp;数据域</i>
                        </div>
                    </div>
                </div>
                <div class="left-tab-body" :class="{'hidden':!closeOrOpenShow}">
                    <div class="data-table" v-show="tabNameActive===1">
                        <div class="table-search">
                            <input type="text" placeholder="快速搜索数据表">
                        </div>
                        <div class="table-dataTables">
                            <tableTree :dataTables="dataTables"></tableTree>
                        </div>
                    </div>
                    <div class="data-area" v-show="tabNameActive===2">
                        222
                    </div>
                </div>
            </div>
            <div class="main-content-right-tab"></div>
        </div>
    </div>
</template>
<script>
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";

import remoteUrl from "@/service/remoteUrl";
import tableTree from "@/components/table-tree";

export default {
    components: {
        tableTree,
    },
    data() {
        return {
            // 当前激活的头部id
            HMHeaderActiveId: 1,
            HMHeaderList: [
                {
                    id: 1,
                    desc: "开始",
                },
                {
                    id: 2,
                    desc: "模型",
                },
            ],
            // 左侧菜单选项卡激活
            tabNameActive: 1,
            //左侧菜单显示隐藏
            closeOrOpenShow: true,
            // 数据表
            dataTables: [],
        };
    },

    created() {
        // 获取数据表数据
        this.queryDataTables();
    },

    mounted() {
        // const lf = new LogicFlow({
        //     container: document.querySelector("#lFow"),
        //     grid: true,
        // });
        // lf.render({
        //     nodes: [
        //         {
        //             id: "1",
        //             type: "rect",
        //             x: 100,
        //             y: 100,
        //             text: "节点1",
        //         },
        //         {
        //             id: "2",
        //             type: "circle",
        //             x: 300,
        //             y: 200,
        //             text: "节点2",
        //         },
        //     ],
        //     edges: [
        //         {
        //             sourceNodeId: "1",
        //             targetNodeId: "2",
        //             type: "polyline",
        //             text: "连线",
        //         },
        //     ],
        // });
    },

    methods: {
        // 返回 首页
        backToHome() {
            this.$router.push({ path: "/home" });
        },
        // 获取数据表数据
        queryDataTables() {
            this.$remote.post(remoteUrl.QUERY_DATA_TABLES, {}, (res) => {
                const {
                    data: { code, data },
                } = res;
                if (code == "000000") {
                    const { modules } = data;
                    this.dataTables = modules;
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.main {
    display: flex;
    height: 100vh;
    flex-direction: column;
    & > .main-header {
        display: flex;
        flex-direction: row;
        background-color: #e3e3e5;
        border-bottom: 1px #b3b4b4 solid;
        color: #444;
        user-select: none;
        & > .main-header-save {
            width: 0.6rem;
            height: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            &:hover {
                color: #5595e9;
            }
            & > .icon {
                font-size: 0.4rem;
            }
            & > span {
                font-size: 14px;
            }
        }
        & > .main-header-menu {
            flex: 1;
            & > .main-header-menu-header {
                height: 0.3rem;
                font-size: 0;
                display: flex;
                justify-content: space-between;
                & > .left {
                    & > span {
                        display: inline-block;
                        color: #888;
                        width: 0.4rem;
                        text-align: center;
                        height: 0.3rem;
                        line-height: 0.3rem;
                        font-size: 12px;
                        cursor: pointer;
                    }
                    & > span:hover {
                        background-color: #ccc !important;
                    }
                    & > span.active {
                        color: #5595e9;
                        background-color: #fff;
                        text-decoration: underline;
                    }
                }
                & > .right {
                    padding-right: 0.1rem;
                    line-height: 0.3rem;
                    cursor: pointer;
                }
            }
            & > .main-header-menu-content {
                height: 0.7rem;
                background-color: #f4f4f4;
                & > .main-header-menu-content-item {
                    display: inline-flex;
                    flex-direction: column;
                    background-color: #f4f4f4;
                    height: 0.6rem;
                    align-items: center;
                    margin: 0.05rem 0;
                    border-right: 1px #cccc solid;
                    padding: 0 0.1rem;
                    & > .main-header-menu-content-item-list {
                        display: flex;
                        height: 0.6rem;

                        li {
                            display: flex;
                            flex-direction: column;
                            min-width: 0.5rem;
                            align-items: center;
                            cursor: pointer;
                            &:hover {
                                color: #5595e9;
                            }
                            .icon {
                                font-size: 0.25rem;
                            }
                            span {
                                font-size: 14px;
                            }
                        }
                    }
                    & > .main-header-menu-content-item-desc {
                        flex: 1;
                        font-size: 14px;
                        color: #aaa;
                    }
                }
            }
        }
    }

    & > .main-content-container {
        flex: 1;
        display: flex;
        background-color: red;
        & > .main-content-left-tab {
            width: 3rem;
            max-width: 4rem;
            background-color: #eceef2;
            transition: width 1s;
            &.close {
                width: 0.2rem;
                max-width: none;
            }
            & > .left-tab-header {
                & > .left-tab-header-icons {
                    display: flex;
                    flex-direction: row-reverse;
                    height: 0.2rem;
                    line-height: 0.2rem;
                    i {
                        margin: 0 0.03rem;
                    }
                    i.fanzhuan {
                        transform: rotate(180deg);
                    }
                }
                & > .left-tab-header-names {
                    width: 100%;
                    display: flex;
                    height: 0.25rem;
                    white-space: nowrap;
                    .name-title {
                        width: 50%;
                        text-align: center;
                        padding: 0.02rem 0;
                        &.active {
                            color: #5595e9;
                            border-bottom: 2px #5595e9 solid;
                        }
                        &:hover {
                            background-color: #ccc;
                            color: #fff;
                        }
                        i {
                            font-size: 14px;
                        }
                    }
                }
            }
            & > .left-tab-body {
                & > .data-table {
                    & > .table-search {
                        height: 0.35rem;
                        background-color: #fff;
                        position: relative;
                        input {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            border-radius: 0.05rem;
                            height: 0.25rem;
                            line-height: 0.25rem;
                            text-indent: 3px;
                            border-color: #ccc;
                            color: #444;
                            width: 80%;
                        }
                    }
                    & > .table-dataTables {
                        height: calc(100vh - 181px);
                        overflow: auto;
                    }
                }
            }
        }
        & > .main-content-right-tab {
            flex: 1;
            background-color: yellow;
        }
    }
}
#lFow {
    height: 100vh;
}
</style>
