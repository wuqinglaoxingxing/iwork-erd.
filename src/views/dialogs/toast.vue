<template>
    <div :class="data[0]" class="toast" ref="toast" @mouseleave="doClose" @mouseenter="doStop()">
        <i class="point icon iconfont" :class="{ 
            'icon-chenggong': data[0]==='info',
            'icon-huangsejinggao':data[0]==='warn',
            'icon-guanbi2':data[0]==='error',
        }"></i>
        <div class="content">
            <h2>
                {{data[1]}}
            </h2>
            <p>
                {{data[2]}}
            </p>
        </div>
    </div>
</template>
<script>
export default {
    props: ["data"],
    data() {
        return {
            timeout: null,
        };
    },
    created() {
        this.timeout = window.setTimeout(() => {
            this.doClose();
        }, 3000);
    },
    methods: {
        doStop() {
            if (this.timeout != null) {
                window.clearTimeout(this.timeout);
            }
        },
        doClose() {
            this.$refs.toast.style.opacity = 0;
            window.setTimeout(() => {
                this.$store.commit("closeDialog");
            }, 2000);
        },
    },
    mounted() {
        const dialogFrame = this.$refs.toast.closest(
            "div[deftype='dialogFrame']"
        );
        if (dialogFrame) {
            dialogFrame.style.transform = "none";
        }
        window.setTimeout(() => {
            this.$refs.toast.style.opacity = 1;
        }, 100);
    },
};
</script>
<style lang="scss" scoped>
.toast {
    position: fixed;
    right: 0.3rem;
    bottom: 0.3rem;
    padding: 0.1rem;
    transition-duration: 2s;
    transition-property: opacity;
    transition-timing-function: ease;
    cursor: pointer;
    opacity: 0;
    min-width: 2rem;
    display:flex;
    color: #fff;
    line-height: 1.4em;
    border-radius: 0.05rem;
    max-width: 3.5rem;
    i{
        width: .3rem;
        text-align: center;
        font-size: 20px;
    }
    &.warn {
        background-color: #f5d27a;
        box-shadow: 0px 0px 10px 1px #f6be33;
        i{
            color: #eba504;
        }
    }
    &.error {
        background-color: #eb6464;
        box-shadow: 0px 0px 10px 1px #eb6464;
        i{
            color: red;
        }
    }
    &.info {
        background-color: #398af3;
        box-shadow: 0px 0px 10px 1px #398af3;
        i{
            color: #72C140;
        }
    }
    & > h2 {
        font-size: 0.14rem;
    }
    & > p {
        font-size: 0.12rem;
    }
}
</style>
