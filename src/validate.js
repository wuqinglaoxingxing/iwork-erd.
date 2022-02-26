import xhtml from './service/xhtml';

/**
 * 表单校验【配置文件】
 * -------------------------
 * 表单校验分为三部分：
 * 1.自定义交易规则和具体的提示信息等配置，也就是本文件
 *
 * 2.定义了规则以后，应用在form上，由指令v-input-check实现
 * 文件位置：src/directive/input-check.js
 *
 * 3.规则应用以后，需要获取当前表单合法性，由全局方法this.$error(formname)提供
 * 文件位置：src/service/input-check.js
 *
 * 另外，表单和具体的输入框上通过class记录着校验的具体结果，可以在定义样式的时候使用。
 */

// 自定义校验规则
export default {

    // 1.required:flag
    "required": function (el, val, flag) {
        let pEl = el.parentNode;

        if (flag === 'false' || flag === false) {

            // 如果不是必输，去掉红星标志
            if (xhtml.hasClass(pEl, 'required-red-star')) xhtml.removeClass(pEl, 'required-red-star');

            return true;
        } else {

            // 如果是必输，添加红星标志
            // 判断是在表格中还是在普通文本框
            if(pEl.nodeName=="TD"){
                const idx = Array.from(pEl.parentNode.children).findIndex(node=>{
                    return pEl === node
                })
                const tr = pEl.closest("table").querySelectorAll("thead>tr>th")[idx]
                const trTmp = pEl.closest("table").previousElementSibling.querySelectorAll("span")[idx]
                if(tr&&!xhtml.hasClass(tr, 'required-red-star')){
                    xhtml.addClass(tr, 'required-red-star')
                    xhtml.addClass(trTmp, 'required-red-star')
                }
            }else{
                if (!xhtml.hasClass(pEl, 'required-red-star')) xhtml.addClass(pEl, 'required-red-star');
            }

            if (val && !/^ +$/.test(val)) {
                return true;
            }
        }
        return false;
    },

    //  2.select
    "select": function (el, val , list) {
        const [vk,rules,selectList] = list
        // 数组直接为true
        if(vm.getTargetType(selectList) === "[object Array]"){
            return selectList.includes(vk)
        }
        if(vm.isNotEmpty(vk)){
            return Object.keys(selectList).some((key)=>{
                return key==vk
            })
        }else{
            return true
        }
    },

    // 3.maxLength:num
    "maxLength": function (el, val, num) {
        val = (val + "").trim();
        return val.length <= num;
    },

    // 4.minLength:num
    "minLength": function (el, val, num) {
        val = (val + "").trim();
        return val.length >= num;
    },

    // 5.regexp:str:attributes
    "regexp": function (el, val, str, attributes="") {
        // 工具自动生成 attributes = gmi
        el.csii_vx3_pteller_validate_regexp = str;
        return new RegExp(str,attributes).test(val);
    },

    // 6.datepiker:str
    "datepiker": function (el, val, str) {
        if(val){
            if(!/\d/g.test(val)){
                return false
            }
            if(val.length!==8){
                return false
            }
            const mon = val.substring(4,6)
            if(mon<1||mon>12){
                return false
            }
            const day = val.substring(6,8)
            const sumDay = new Date(val.substring(0,4), mon, 0).getDate();
            if(day>sumDay||day<1){
                return false
            }
            return true
        }else{
            return true
        }
    },

    // 7. recheckInput
    "recheckInput":function(el,val,flg){
        if(flg==="true"){
            return el.value===el.__recheck_value__
        }else{
            return true
        }
    },
    // 8. rate
    "rate":function(el,val){
        if(parseInt(val)<0){
            return false
        }
        if(vm.isNotEmpty(val)){
            if(/^\d+\.\d+$/g.test(val)){
                return true
            }else{
                return false
            }
        }
        return true
    },
    // 9. time
    "time":function(el,val){
        if(vm.isNotEmpty(val)){
            if(/^(20|21|22|23|[0-1]\d)[0-5]\d[0-5]\d$/g.test(val)){
                return true
            }else{
                return false
            }
        }
        return true
    }
};

// 自定义错误提示
// 请和上面的对应起来，上面未定义的采用默认提示
export let errorinfo = [

    // 1.必输
    ["required", function (el, name) {
        return name + "是必输项！";
    }],

    // 2.下拉
    ["select", function (el, name) {
        return name + "下拉key非法！";
    }],

    // 3.最大长度
    ["maxLength", function (el, name) {
        return name + "超过最大长度！";
    }],

    // 4.最短长度
    ["minLength", function (el, name) {
        return name + "短于最短长度！";
    }],

    // 5.正则表达式
    ["regexp", function (el, name) {
        let msg = el.getAttribute("msg")||"不满足正则表达式：" + el.csii_vx3_pteller_validate_regexp;
        return name + msg
    }],
    
    // 6.日期
    ["datepiker", function (el, name) {
        return name + "日期格式不满足！";
    }],

    // 7.日期
    ["recheckInput", function (el, name) {
        return name + "复核字段与经办时输入不一致，请检查后重新输入";
    }],

    // 8. rate
    ["rate", function (el, name) {
        return name + "利率格式不正确";
    }],

    // 8. rate
    ["time", function (el, name) {
        return name + "时间格式不正确";
    }]

];
