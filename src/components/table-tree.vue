<template>
    <div class="data-tables-container">
        <ul class="data-tables" v-for="dt in dataTablesTmp" :key="dt.name">
            <li class="graphCanvas pointer" @click="setLIBg($event.currentTarget)" @dblclick.stop="dt.open=!dt.open">
                <i class="icon iconfont icon-xialajiantouxiao" :class="{'fanzhuan':dt.open,'bufanzhuan':!dt.open}"
                    style="color:#4C5058;" @click="dt.open=!dt.open"></i>
                <i class="icon iconfont icon-wenjianjia" style="color:#EAA84B;">{{dt.name}}</i>
            </li>
            <ul class="dt-wrapper" v-show="dt.open">
                <li class="guanxitu pointer" @click="setLIBg($event.currentTarget)">
                    <i class="icon iconfont icon-guanxitu" style="color:#68AB36;">&nbsp;关系图</i>
                </li>
                <ul class="entities-wrapper">
                    <li class="entity pointer" @click="setLIBg($event.currentTarget)"
                        @dblclick.stop="dt.openT=!dt.openT">
                        <i class="icon iconfont icon-xialajiantouxiao" @click="dt.openT=!dt.openT"
                            :class="{'fanzhuan':dt.open&&dt.openT,'bufanzhuan':!dt.open||!dt.openT}"
                            style="color:#4C5058;">
                        </i>
                        <i class="icon iconfont icon-wenjianjia" style="color:#EAA84B;">数据表</i>
                    </li>
                    <ul class="entities" v-show="dt.open&&dt.openT">
                        <li class="entity-table pointer" v-for="table in dt.entities" :key="table.title"
                            @click="setLIBg($event.currentTarget)">
                            <i class="icon iconfont icon-biaodanzujian-biaoge" style="color:#408BD6;"></i>
                            <span :title="table.title+'['+table.chnname+']'">{{table.title}}[{{table.chnname}}]</span>
                        </li>
                    </ul>
                </ul>
            </ul>

        </ul>
    </div>
</template>

<script>
import _ from "lodash";
export default {
    name: "tableTree",
    props: ["dataTables"],
    data() {
        return {
            dataTablesTmp: [],
            lastActiveEl: null,
        };
    },
    created() {
        setTimeout(() => {
            console.log(this.dataTables);
        }, 2000);
    },
    mounted() {},
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
    methods: {
        // 设置展示对象
        setDataTablesTmp(modules) {
            this.dataTablesTmp = modules.map((module) => {
                const isHas = Reflect.has(module, "open");
                const isHasT = Reflect.has(module, "openT");
                if (!isHas) module.open = false;
                if (!isHasT) module.openT = false;
                return module;
            });
        },
        // 设置背景
        setLIBg(target) {
            const self = this;
            self.lastActiveEl && self.lastActiveEl.classList.remove("active");
            self.lastActiveEl = target;
            target.classList.add("active");
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
                        margin-left: .02rem;
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