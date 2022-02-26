/**
 * 配置公共方法
 * ------------------
 */
export default {
    install(Vue) {
        /**
         * 用途:正则匹配所有的数据
         * pattern:正则表达式 元组 /trade\/(\d+)\.do/g
         * inputStr:匹配字符串
         * 返回：匹配的数组
         * */
        // 正则匹配所有的数据
        Vue.prototype.getAllDataByRegex = function (pattern, inputStr) {
            var arr = [];
            var result;
            while ((result = pattern.exec(inputStr)) != null) {
                arr.push(result[1])
            }
            return arr;
        }

        /**
         **功能：判断传入的是不是空对象，空数组，空串。。。
         * */
        Vue.prototype.isNotEmpty = function (params) {
            switch (this.getTargetType(params)) {
                case "[object Object]":
                    return Object.keys(params).length;
                case "[object Array] ":
                    return params.length
                case "[object String]":
                    return params.length !== 0
                case "[object Undefined]":
                    return false
                case "[object Null]":
                    return false
                case "[object Boolean]":
                    return params
                default:
                    return true
            }
        }
        /**
         * 用途:获取目标类型
         * target:传入的目标
         * 返回：字符串（目标类型）
         * */
        Vue.prototype.getTargetType = function (target) {
            // [object String] [object Number]
            // [object Boolean] [object Symbol]
            // [object Undefined]  [object Null]
            // [object Function] [object Date]
            // [object Array] [object RegExp] 
            // [object Error] [object HTMLDocument] 
            // [object Object] [object global] window 是全局对象 global 的引用
            return Object.prototype.toString.call(target);
        }
        /**
         * 通用的弹框方法
         * ========================
         */

        // 提示信息
        Vue.prototype.alert = function (msg, title, funPos) {
            msg = msg || "未知错误";

            this.$store.commit("openDialog", {
                id: "warning",
                initdata: ["alert", msg, title || "温馨提示", "确定"],
                callback: function () {
                    if (typeof funPos == "function") funPos();
                },
                noShade: false
            })
        };

        // 确认信息
        Vue.prototype.confirm = function (
            title,
            msg,
            actionPos,
            actionNeg,
            mesPos,
            mesNeg
        ) {
            if (!title || !msg || typeof actionPos !== "function")
                throw Error("Title、Message和积极回调为必传参数！");

            this.$store.commit("openDialog",{
                id:"warning",
                initdata:["confirm", msg, title, mesPos || "确定", mesNeg || "取消"],
                callback:function (msg) {
                    if (msg == "yes") actionPos();
                    else if (msg == "no" && typeof actionNeg == "function")
                        actionNeg();
                }

            });
        };

        // toast
        Vue.prototype.toast = function (type, title, msg) {
            this.$store.commit("openDialog", {
                id: "toast",
                initdata: [type, title, msg],
                noShade: true
            })
        };

    }
};
