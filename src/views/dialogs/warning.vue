<template>
    <div class="warning animate__animated animate__fadeInDown">
        <h2 v-dragdrop>
            {{data[2]}}
            <span @click="$store.commit('closeDialog')">
                <i class="icon iconfont icon-chahao"></i>
            </span>
        </h2>
        <div>
            <div class='content' v-html="data[1]"></div>
            <div class='btlist'>
                <input type="button" class='btn_main_s' :value="data[3]" @click="$store.commit('closeDialog','yes')">
                <input type="button" class='btn_second_s' :value="data[4]" @click="$store.commit('closeDialog','no')"
                    v-if='data[0]=="confirm"'>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ["data"],
};
</script>
<style lang="scss" scoped>
@import "@/style/dialog.scss";
.warning {
    width: 4.2rem;
    margin: auto;

    & > h2 {
        background-color: $dialog-title-bg-color;
        line-height: 0.38rem;
        padding-left: 0.2rem;
        color: $dialog-title-color;
        border-radius: 0.05rem 0.05rem 0 0;
        font-size: 0.14rem;
        position: relative;
        & > span {
            position: absolute;
            right: 0.2rem;
            font-size: 0.2rem;
            cursor: pointer;
        }
    }
    & > div {
        background-color: $white;
        border-radius: 0 0 0.05rem 0.05rem;
        line-height: 0.2rem;
        & > div {
            padding: 0.15rem;
            &.content {
                color: $content-color;
                font-size: 0.12rem;
                max-height: 2rem;
                overflow: auto;
            }
            &.btlist {
                padding-top: 0;
                text-align: right;
                margin-top: 0.1rem;
                & > input {
                    margin-left: 0.1rem;
                }
            }
        }
    }
}
</style>
