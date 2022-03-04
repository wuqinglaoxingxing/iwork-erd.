<template>
    <div class="warning">
        <h2 v-dragdrop>
            说明详情
            <span @click="$store.commit('closeDialog')">
                <i class="icon iconfont icon-chahao"></i>
            </span>
        </h2>
        <div>
            <div class='content'>
                <textarea spellcheck="false" v-model="content">
                </textarea>
            </div>
            <div class='btlist'>
                <input type="button" class='btn_main_s' value="确定" @click="$store.commit('closeDialog',content)">
                <input type="button" class='btn_second_s' value="取消" @click="$store.commit('closeDialog')">
            </div>
        </div>
    </div>
</template>
<script>
import _ from "lodash";
export default {
    props: ["data"],
    data() {
        return {
            content: "",
        };
    },
    created() {
        this.content = _.cloneDeep(this.data);
    },
};
</script>
<style lang="scss" scoped>
@import "@/style/dialog.scss";
.warning {
    min-width: 55vw;
    max-width: 80vw;
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
                overflow: auto;
                & > textarea {
                    width: 100%;
                    height: 2rem;
                    overflow: auto;
                    resize: none;
                    border:$border;
                    color: $content-color;
                }
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
