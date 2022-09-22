<template>
    <div class="rootApp">
        <!-- 主界面 -->
        <div class="ui-main">
            <router-view></router-view>
        </div>

        <!-- 弹框组件 -->
        <!-- 遮掩层99 弹框层100+ -->
        <div class="ui-dialog">
            <!-- 统一遮罩 -->
            <div
                @click.stop="$store.commit('closeDialog')"
                class="view shade"
                v-if="
                    $store.state.dialogs.length > 0 &&
                    !$store.state.dialogs[$store.state.dialogs.length - 1].shade
                "
            ></div>
            <div
                v-for="(dialog, index) in $store.state.dialogs"
                :key="index"
                defType="dialogFrame"
            >
                <div @click.stop="doIt()">
                    <component
                        v-bind:is="dialogs[dialog.id]"
                        v-bind:data="dialog.data"
                    ></component>
                </div>
            </div>
        </div>

        <canvas id="canvas" width="400" height="360"></canvas>
        <input type="file" id="importFile" style="display: none" />
    </div>
</template>
<script>
// 引入弹框页面
import dialogs from "@/views/lazy-load-dialog";

export default {
    data() {
        return {
            dialogs: dialogs,
        };
    },
    methods: {
        doIt() {},
    },
};
</script>
