<template>
    <div :class="data[0]" class="toast" ref="toast" @mouseleave="doClose" @mouseenter="doStop()">
        <h2>
            {{data[1]}}
        </h2>
        <p>
            {{data[2]}}
        </p>
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
        const dialogFrame = this.$refs.toast.closest("div[deftype='dialogFrame']") 
        if(dialogFrame){
            dialogFrame.style.transform = "none"
        }
        window.setTimeout(() => {
            this.$refs.toast.style.opacity = 1;
        }, 100);
    },
};
</script>
<style lang="scss" scoped>
.toast {
    display: inline-block;
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
    &.warn {
        background-color: rgb(247, 184, 10);
        box-shadow: 0px 0px 10px 1px #f6be33;
    }
    &.error {
        background-color: #d81e1e;
        box-shadow: 0px 0px 10px 1px #d81e1e;
    }
    &.info {
        background-color: #1fee5e;
        box-shadow: 0px 0px 10px 1px #1fee5e;
    }
    background-image: url("../../asset/image/tradesys/23.png");
    background-repeat: no-repeat;
    background-position: 0.1rem center;
    background-size: auto 50%;
    padding-left: 0.7rem;
    color: #fff;
    line-height: 1.4em;
    border-radius: 0.05rem;
    max-width: 3.5rem;
    & > h2 {
        font-size: 0.14rem;
    }
    & > p {
        font-size: 0.12rem;
    }
}
</style>
