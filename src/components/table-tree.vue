<template>
    <div class="data-tables-container">
        <ul class="data-tables" v-for="dt in dataTablesTmp" :key="dt.name">
            <li
                class="graphCanvas pointer"
                @click="setLIBg($event.currentTarget)"
                @dblclick.stop="dt.open = !dt.open"
                :id="dt.name"
            >
                <i
                    class="icon iconfont icon-xialajiantouxiao"
                    :class="{ fanzhuan: dt.open, bufanzhuan: !dt.open }"
                    style="color: #4c5058"
                    @click="dt.open = !dt.open"
                ></i>
                <i
                    class="icon iconfont icon-wenjianjia"
                    style="color: #eaa84b"
                    >{{ dt.name }}</i
                >
            </li>
            <ul class="dt-wrapper" v-show="dt.open">
                <li
                    class="guanxitu pointer"
                    @click="setLIBg($event.currentTarget)"
                    @dblclick="openContent('graph', dt.name, dt.graphCanvas)"
                    :id="dt.name + '-graph'"
                >
                    <i
                        class="icon iconfont icon-guanxitu"
                        style="color: #68ab36"
                        >&nbsp;关系图</i
                    >
                </li>
                <ul class="entities-wrapper">
                    <li
                        class="entity pointer"
                        @click="setLIBg($event.currentTarget)"
                        @dblclick.stop="dt.openT = !dt.openT"
                    >
                        <i
                            class="icon iconfont icon-xialajiantouxiao"
                            @click="dt.openT = !dt.openT"
                            :class="{
                                fanzhuan: dt.open && dt.openT,
                                bufanzhuan: !dt.open || !dt.openT,
                            }"
                            style="color: #4c5058"
                        >
                        </i>
                        <i
                            class="icon iconfont icon-wenjianjia"
                            style="color: #eaa84b"
                            >数据表</i
                        >
                    </li>
                    <ul class="entities" v-show="dt.open && dt.openT">
                        <li
                            class="entity-table pointer"
                            v-for="(table, idx) in dt.entities"
                            :key="idx"
                            :id="dt.name + '-' + table.title"
                            @click="setLIBg($event.currentTarget)"
                            @dblclick="openContent('tbl', dt.name, table)"
                            draggable="true"
                            @dragstart="dragstart($event, { dt, table })"
                            @dragend="dragend"
                            @drag="drag"
                        >
                            <i
                                class="icon iconfont icon-biaodanzujian-biaoge"
                                style="color: #408bd6"
                            ></i>
                            <span
                                :title="table.title + '[' + table.chnname + ']'"
                                >{{ table.title }}[{{ table.chnname }}]</span
                            >
                        </li>
                    </ul>
                </ul>
            </ul>
        </ul>
    </div>
</template>

<script>
import _ from "lodash";
import {
    drawSetTitle,
    drawFields,
    drawFieldsLine,
    drawReactRadius,
} from "@/service/canvasTable";
export default {
    name: "tableTree",
    props: ["dataTables"],
    data() {
        return {
            // 展示数据
            dataTablesTmp: [],
            // 默认打开还是关闭
            floderSymbol: true,
        };
    },
    created() {},
    watch: {
        dataTables: {
            handler(n, o) {
                const newV = _.cloneDeep(n);
                // 处理数据
                this.setDataTablesTmp(newV);
            },
            immediate: true,
            deep: true,
        },
    },
    mounted() {
        this.draw();
    },
    methods: {
        draw(params) {
            const canvas = document.getElementById("canvas");
            //获得 2d 上下文对象
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, 400, 400); //清空所有的内容
            drawReactRadius(ctx, params);
            drawSetTitle(ctx, params);
            // drawFieldsLine(ctx, params);
            drawFields(ctx, params);
        },
        dragstart(e, params) {
            console.log(e, params);
            e.dataTransfer.setData("cursor", e.currentTarget.style.cursor);
            e.currentTarget.style.cursor = "move";
            this.draw(params);
            const canvas = document.querySelector("#canvas");
            e.dataTransfer.setDragImage(canvas, 200, 200);
        },
        drag(e) {
            // console.log(e, this);
        },
        dragend(e) {
            e.currentTarget.style.cursor = e.dataTransfer.getData("cursor");
            // console.log(e, this);
        },
        // 设置展示对象
        setDataTablesTmp(modules) {
            this.dataTablesTmp = modules.map((module) => {
                const isHas = Reflect.has(module, "open");
                const isHasT = Reflect.has(module, "openT");
                if (!isHas) module.open = this.floderSymbol;
                if (!isHasT) module.openT = this.floderSymbol;
                return module;
            });
        },
        // 设置点击的el
        setLIBg(target) {
            const curActive = document.querySelector(
                ".data-tables-container li.active"
            );
            curActive && curActive.classList.remove("active");
            target.classList.add("active");
        },
        // 打开内容区域
        openContent(pos, name, value) {
            // 对于视图需要添加实体数据，供后续使用
            if (pos === "graph") {
                value.entities = this.dataTables.find(
                    (dataTable) => dataTable.name === name
                ).entities;
            }
            this.$emit("open-content", { pos, name, value });
        },
    },
};
</script>

<style lang="scss" scoped>
.fanzhuan {
    transform: rotate(0deg);
}
.bufanzhuan {
    transform: rotate(-90deg) translateX(1px);
}
.icon-xialajiantouxiao {
    margin: 0 0.03rem;
}
li.active {
    background: #d0ddf4;
}
i {
    font-size: 14px !important;
}

.data-tables-container {
    font-size: 14px;
    user-select: none;
    .data-tables {
        .graphCanvas {
            height: 0.25rem;
            line-height: 0.25rem;
            display: flex;
        }
        .dt-wrapper {
            .guanxitu {
                padding-left: 0.22rem;
                height: 0.25rem;
                line-height: 0.25rem;
            }
            .entities-wrapper {
                .entity {
                    padding-left: 0.2rem;
                    height: 0.25rem;
                    line-height: 0.25rem;
                    display: flex;
                }
                .entities {
                }
                .entity-table {
                    display: flex;
                    padding-left: 0.4rem;
                    height: 0.25rem;
                    line-height: 0.25rem;
                    span {
                        display: inline-block;
                        margin-left: 0.02rem;
                        color: #454545;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
    }
}
</style>
