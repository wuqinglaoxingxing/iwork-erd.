<template>
    <div class="main">
        <!-- <div class="main-header">
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
        </div> -->
        <div class="main-content-container">
            <div
                class="main-content-left-tab"
                :class="{ close: !closeOrOpenShow }"
            >
                <div class="left-tab-header">
                    <div class="left-tab-header-icons">
                        <i
                            class="icon iconfont icon-xiangzuo pointer"
                            :class="{ fanzhuan: !closeOrOpenShow }"
                            @click="closeOrOpenShow = !closeOrOpenShow"
                        ></i>
                        <i class="icon iconfont icon-shuaxin1 pointer"></i>
                    </div>
                    <div
                        class="left-tab-header-names"
                        :class="{ hidden: !closeOrOpenShow }"
                    >
                        <div
                            class="name-title pointer"
                            :class="{ active: tabNameActive === 1 }"
                            @click="tabNameActive = 1"
                        >
                            <i class="icon iconfont icon-shuju_biao"
                                >&nbsp;数据表</i
                            >
                        </div>
                        <div
                            class="name-title pointer"
                            :class="{ active: tabNameActive === 2 }"
                            @click="tabNameActive = 2"
                        >
                            <i class="icon iconfont icon-shujuyu"
                                >&nbsp;数据域</i
                            >
                        </div>
                    </div>
                </div>
                <div
                    class="left-tab-body"
                    :class="{ hidden: !closeOrOpenShow }"
                >
                    <div class="data-table" v-show="tabNameActive === 1">
                        <div class="table-search">
                            <input type="text" placeholder="快速搜索数据表" />
                        </div>
                        <div class="table-dataTables">
                            <tableTree
                                @open-content="openContent"
                                :dataTables="dataTables"
                                :dataTypeDomains="dataTypeDomains"
                            ></tableTree>
                        </div>
                    </div>
                    <div class="data-area" v-show="tabNameActive === 2">
                        222
                    </div>
                </div>
            </div>
            <div class="main-content-right-tab">
                <!-- 选项卡 -->
                <nav>
                    <ul class="nav-view" v-if="views.length > 0" ref="navView">
                        <li
                            v-for="view in views"
                            :key="view.id"
                            :name="view.name"
                            class="point"
                            :view-id="view.id"
                            @click="turnToPage(view)"
                            :class="{ active: cur_content == view.id }"
                        >
                            <i
                                class="point icon iconfont"
                                :class="{
                                    'icon-biaodanzujian-biaoge':
                                        view.pos === 'tbl',
                                    'icon-guanxitu': view.pos === 'graph',
                                }"
                            ></i>
                            <a :title="view.name">
                                {{ view.name }}
                            </a>
                            <!-- 关闭内容 -->
                            <span class="close-wrap">
                                <i
                                    class="close icon iconfont closeA"
                                    :class="{
                                        'icon-guanbi2': !view.unupdated,
                                        'icon-yuandianzhong': view.unupdated,
                                    }"
                                    @click.stop="closePage(view)"
                                >
                                </i>
                                <i
                                    class="close icon iconfont icon-guanbi2 closeB"
                                    @click.stop="closePage(view)"
                                >
                                </i>
                            </span>
                        </li>
                    </ul>
                </nav>
                <article>
                    <div
                        class="view-cotent"
                        :view-id="view.id"
                        :key="view.id"
                        v-show="cur_content == view.id"
                        :class="{ active: cur_content == view.id }"
                        v-for="view in views"
                    >
                        <component
                            v-bind:is="view.page"
                            v-bind:link_data="view"
                            @upView="upView"
                            @upNavState="upNavState"
                            :dataTypeDomains="dataTypeDomains"
                            class="animate__animated animate__fadeIn"
                        ></component>
                    </div>
                    <div v-show="views.length === 0" class="view-empty">
                        双击左侧树图开始工作吧
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>
<script>
import "@logicflow/core/dist/style/index.css";

import remoteUrl from "@/service/remoteUrl";
import tableTree from "@/components/table-tree";
// 引入交易页面
import pages from "./lazy-load-content";

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
            // 数据域
            dataTypeDomains: {},

            // 标记当前打开的交易
            cur_content: "",
            // 展示内容区域
            views: [],
        };
    },

    watch: {
        cur_content(val, oldVal) {
            const navView = this.$refs["navView"];
            if (navView) {
                // 移动nav滚动条，让激活的nav显示
                this.$nextTick(() => {
                    // 右侧距离
                    const padding = 5;
                    // 如果出现滚动条
                    if (navView.scrollWidth > navView.clientWidth) {
                        const liActive = navView.querySelector("li.active");
                        if (liActive) {
                            // 判断是否需要滚动
                            if (
                                liActive.offsetLeft +
                                    liActive.clientWidth -
                                    navView.scrollLeft >
                                    navView.clientWidth ||
                                liActive.offsetLeft +
                                    liActive.clientWidth -
                                    navView.scrollLeft <
                                    0 ||
                                liActive.offsetLeft +
                                    liActive.clientWidth -
                                    navView.scrollLeft <
                                    liActive.clientWidth
                            ) {
                                const toMovePx =
                                    liActive.offsetLeft +
                                    liActive.clientWidth -
                                    navView.clientWidth;
                                navView.scrollTo(toMovePx + padding, 0);
                            }
                        }
                    }
                });
            }
            // 左侧树的激活样式
            const dataTablesContainer = document.querySelector(
                ".data-tables-container"
            );
            const entityTableActive =
                dataTablesContainer &&
                dataTablesContainer.querySelector("li.active");
            if (dataTablesContainer) {
                this.$nextTick(() => {
                    const curActive = dataTablesContainer.querySelector(
                        "li[id=" + val + "]"
                    );
                    entityTableActive &&
                        entityTableActive.classList.remove("active");
                    curActive && curActive.classList.add("active");
                    const parentNode = dataTablesContainer.parentElement;
                    // 如果出现滚动条
                    if (parentNode.scrollHeight > parentNode.clientHeight) {
                        if (curActive) {
                            // 判断是否需要滚动
                            if (
                                curActive.offsetTop +
                                    curActive.clientHeight -
                                    parentNode.scrollTop >
                                    parentNode.clientHeight ||
                                curActive.offsetTop +
                                    curActive.clientHeight -
                                    parentNode.scrollTop <
                                    0
                            ) {
                                const toMovePx =
                                    curActive.offsetTop +
                                    curActive.clientHeight -
                                    parentNode.clientHeight;
                                console.log(toMovePx);
                                parentNode.scrollTo(0, toMovePx);
                            }
                        }
                    }
                });
            }
        },
    },
    created() {
        // 获取数据表数据
        this.queryDataTables();
        // 获取数据类型数据域
        this.queryDataTypeDomains();
    },

    methods: {
        // 返回 首页
        backToHome() {
            this.$router.push({ path: "/home" });
        },
        // 获取数据表数据
        queryDataTables() {
            import("../../mock/student.json").then((student) => {
                this.dataTables = student.modules;
            });
            // this.$remote.post(remoteUrl.QUERY_DATA_TABLES, {}, (res) => {
            //     const {
            //         data: { code, data },
            //     } = res;
            //     if (code == "000000") {
            //         const { modules } = data;
            //         this.dataTables = modules;
            //     }
            // });
        },
        // 获取数据类型数据域
        queryDataTypeDomains() {
            import("../../mock/student.json").then((student) => {
                this.dataTypeDomains = student.dataTypeDomains;
            });
            // this.$remote.post(remoteUrl.QUERY_DATA_TYPE_DOMAINS, {}, (res) => {
            //     const {
            //         data: { code, data },
            //     } = res;
            //     if (code == "000000") {
            //         const { dataTypeDomains } = data;
            //         this.dataTypeDomains = dataTypeDomains;
            //     }
            // });
        },
        // 打开内容
        openContent(params) {
            const { name, pos, value } = params;
            const contentID =
                pos === "tbl" ? name + "-" + value.title : name + "-" + pos;
            const contentNm =
                pos === "tbl" ? `${value.title}[${value.chnname}]` : name;
            console.warn("内容ID：" + contentID + "\n参数：" + value);
            // 打开直接显示
            for (let i = 0; i < this.views.length; i++) {
                if (this.views[i].id === contentID) {
                    this.cur_content = this.views[i].id;
                    return;
                }
            }
            this.cur_content = contentID;

            let pageName = {
                graph: "graph-content",
                tbl: "table-content",
            }[pos];

            this.views.push({
                id: contentID,
                name: contentNm,
                page: pages[pageName],
                pos: pos,
                datas: {
                    scope: name,
                    value,
                },
            });
        },
        // 切换视图
        turnToPage(view) {
            const { id, name } = view;
            this.cur_content = id;
        },
        // 关闭视图
        closePage(view) {
            const index = this.views.findIndex((item) => {
                return item.id === view.id;
            });
            this.views.splice(index, 1);
            // 判断删除的视图位置
            // 在开头
            if (index === 0) {
                if (this.views.length > 0) {
                    this.cur_content = this.views[0].id;
                }
                // 在末尾
            } else if (index === this.views.length) {
                if (this.views.length > 0) {
                    this.cur_content = this.views[this.views.length - 1].id;
                }
                // 在中间
            } else {
                this.cur_content = this.views[index].id;
            }
        },
        // 更新navstate
        upNavState({ id, up }) {
            // 表示数据以及更改
            const idx = this.views.findIndex((view) => view.id === id);
            if (up) {
                this.$set(this.views[idx], "unupdated", true);
            } else {
                // 表示数据未更改
                this.$set(this.views[idx], "unupdated", false);
            }
        },
        // 更新view
        upView({ id, info }) {
            // 表示数据以及更改
            const idx = this.views.findIndex((view) => view.id === id);
            this.$set(this.views, idx, info);
            this.$set(this.views[idx], "unupdated", false);
            // 设置dataTables
            for (let i = 0; i < this.dataTables.length; i++) {
                const dataTable = this.dataTables[i];
                const { scope, value } = info.datas;
                if (dataTable.name === scope) {
                    for (let j = 0; j < dataTable.entities.length; j++) {
                        const entity = dataTable.entities[j];
                        if (entity.title === value.title) {
                            this.$set(dataTable.entities, j, value);
                            break;
                        }
                    }
                }
            }
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
        overflow: hidden;
        & > .main-content-left-tab {
            width: 3rem;
            background-color: #eceef2;
            transition: width 1s;
            &.close {
                width: 0.2rem;
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
                        position: relative;
                        height: calc(100vh - 181px);
                        overflow: auto;
                    }
                }
            }
        }
        & > .main-content-right-tab {
            flex: 1;
            overflow: auto;
            & > nav {
                .nav-view {
                    // 滚动计算需要
                    position: relative;
                    display: flex;
                    height: 0.4rem;
                    background-color: #e5e5e5;
                    overflow: auto;
                    li {
                        display: flex;
                        align-items: center;
                        justify-content: space-around;
                        white-space: nowrap;
                        line-height: 0.3rem;
                        background-color: #fff;
                        margin: 5px 0 5px 5px;
                        border-radius: 0.02rem;
                        border-top: 2px #fff solid;
                        user-select: none;

                        &.active {
                            background: #d0ddf4;
                            border-top: 2px #5595e9 solid;
                        }

                        &:last-child {
                            margin-right: 5px;
                        }
                        &:hover {
                            i.close {
                                color: red;
                            }
                            i.icon-yuandianzhong {
                                color: #bfbfbf;
                            }
                        }
                        a {
                            display: inline-block;
                            // width: 1rem;
                            // text-overflow: ellipsis;
                            // overflow: hidden;
                            font-size: 12px;
                            margin: 0 0.03rem;
                            cursor: pointer;
                        }
                        i.point {
                            margin-left: 0.05rem;
                            color: #989898;
                            font-weight: bold;
                            font-size: 14px;
                            &.active {
                                color: #5595e9;
                            }
                        }
                        i.close {
                            color: #ccc;
                            margin: 0 0.05rem 0 0;
                            cursor: pointer;
                        }

                        i.icon-yuandianzhong {
                            color: #bfbfbf;
                        }

                        .close-wrap {
                            i.close.closeB {
                                display: none;
                            }
                        }

                        .close-wrap:hover {
                            i.close.closeA {
                                display: none;
                            }
                            i.close.closeB {
                                display: inline-block;
                            }
                        }
                    }
                }
                .nav-view::-webkit-scrollbar {
                    height: 0.04rem;
                }
            }
            & > article {
                .view-cotent {
                    margin: 0 0.1rem;
                }
                .view-empty {
                    margin-top: 1rem;
                    text-align: center;
                    color: #585858;
                }
            }
        }
    }
}
</style>
