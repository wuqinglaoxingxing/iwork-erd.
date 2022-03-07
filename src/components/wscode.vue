<template>
    <div class="wscode">
        <div class="wscode-oprt">
            <i class="icon iconfont icon-fuzhi" @click="copy"></i>
        </div>
        <codemirror ref="wscode" class="edit" :value="code" :options="cmOptions" @ready="onCmReady" @focus="onCmFocus"
            @input="onCmCodeChange">
        </codemirror>
    </div>
</template>
<script>
import { codemirror } from "vue-codemirror";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/darcula.css";
import "codemirror/theme/eclipse.css";
import "codemirror/lib/codemirror.css";

export default {
    props: ["data"],
    components: {
        codemirror,
    },
    data() {
        return {
            code: "",
            cmOptions: {
                // codemirror options
                tabSize: 4,
                mode: "text/javascript",
                theme: "darcula",
                lineNumbers: true,
                line: true,
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                matchBrackets: true, //括号匹配
                lineWrapping: true, //代码折叠
                readOnly:"nocursor" //不允许聚焦
            },
        };
    },
    watch:{
       "data": {
           handler(n, o) {
                this.code = _.cloneDeep(n);
                // 处理数据
            },
            immediate: true,
            deep: true,
       },
    },
    computed: {
        codemirror() {
            return this.$refs.wscode.codemirror;
        },
    },
    methods: {
        format() {
            this.code = this.$jsBeautify(this.code, {
                indent_with_tabs: true, //使用tab缩进
                indent_level: 0,
                space_in_empty_paren: false,
                max_preserve_newlines: 2,
                space_in_paren: true,
            });
        },
        onCmReady(cm) {},
        onCmFocus(cm) {},
        onCmCodeChange(newCode) {
            this.code = newCode;
        },

        copy(){
            // 写入剪贴板
            navigator.clipboard.writeText(this.code)
            .then(() => {
                this.toast("info","复制成功","可以粘贴啦")
            })
            .catch(err => {
                this.toast("error","复制失败",err)
            });
            // 读取
            // navigator.clipboard.readText()
            // .then(text => {
            //     // `text` contains the text read from the clipboard
            // })
            // .catch(err => {
            //     // maybe user didn't grant access to read from clipboard
            //     console.log('Something went wrong', err);
            // });
        }
    },
};
</script>
<style lang="scss">
.CodeMirror {
    opacity: 0.9;
    min-height: 300px;
    font-size: 0.13rem;
}
.wscode-oprt{
    margin: .02rem;;
}

</style>