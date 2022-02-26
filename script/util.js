//解决ie不支持closest方法（用于查找父元素）
if (!Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
        var el = this;

        do {
            if (Element.prototype.matches.call(el, s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

/**
 * 用途:判断目标是否在数组中(简单判断)
 * target:被判断额数据
 * arr:所要判断的数组
 * 
 * 返回: true存在，false不存在
 * */
function checkSimpleInArrayExist(target, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (target === arr[i]) {
            return true;
        }
    }
    return false;
}

/**
 * 用途:返回该对象是否存在于指定数组标志
 * obj:被判断额对象
 * arr:所要判断的数组
 * 
 * 返回: true存在，false不存在
 * */
function checkObjectInArrayExist(obj, arr) {
    let objKeys = Object.keys(obj);
    for (let i = 0; i < arr.length; i++) {
        let objInArr = arr[i];
        let objInArrKeys = Object.keys(objInArr);
        let trueFlg = 0;
        for (let j = 0; j < objInArrKeys.length; j++) {
            if (obj[objInArrKeys[j]] && obj[objInArrKeys[j]] == arr[i][objInArrKeys[j]]) {
                trueFlg += 1
            }
        }
        if (trueFlg == objKeys.length) {
            return true;
        }
    }
    return false;
}

/**
 * 用途:打乱数组索引
 * arr:传入的数组
 * 返回：打乱数组的索引数组
 * */
function getRandomNumberArr(arr) {
    var arrNum = [];
    for (var i = 0; i < arr.length; i++) {
        arrNum.push(i)
    }
    var temp;
    for (var i = 0; i < arrNum.length; i++) {
        var rand = parseInt(Math.random() * arrNum.length);
        temp = arrNum[rand];
        arrNum[rand] = arrNum[i];
        arrNum[i] = temp;
    }
    return arrNum;
}

/**
 * 用途:打乱数组索引
 * arr:传入的数组
 * 返回：打乱数组的索引数组
 * */
Array.prototype.random = function () {
    this.sort(function (a, b) {
        return Math.random() - 0.5
    })
}

/**
 * 用途:删除数组中重复元素
 * arr:传入的数组
 * 返回:没有重复元素的数组
 * */
Array.prototype.delRepeat = function () {
    var len = this.length;
    var DEL_FLAG = "__underfined__"
    for (var i = 0; i < len; i++) {
        var preValue = this[i]
        if (preValue == DEL_FLAG) {
            continue;
        }
        var preType = getTargetType(preValue)
        for (var j = i + 1; j < len; j++) {
            var nextValue = this[j]
            var nextType = getTargetType(nextValue)
            if (preType != nextType) {
                continue;
            } else {
                switch (preType) {
                    case "[object Object]":
                        // 调用深度比较对象方法
                        if (!(compareObjDeepEqual(preValue, nextValue).flag)) {
                            continue;
                        }
                        break;
                    case "[object Array]":
                        // 利用深度比较对象方法
                        var preObj = {
                            "obj": preValue.delRepeat()  //多维数组去重
                        }
                        var nextObj = {
                            "obj": nextValue.delRepeat()  //多维数组去重
                        }
                        if (!(compareObjDeepEqual(preObj, nextObj).flag)) {
                            continue;
                        }
                        break;
                    default:
                        if (preValue !== nextValue) {
                            continue;
                        }
                }
            }
            this.splice(j, 1, DEL_FLAG)
        }
    }
    for (var i = 0; i < len; i++) {
        if (this[i] == DEL_FLAG) {
            this.splice(i, 1)
        }
    }
    return this;
}

/**
 * 用途:给元素绑定事件(支持任意组合键方式)
 * dom:dom节点
 * event_name:事件名称
 * keyCodeArr:按键的keyCode,可支持任意组合
 * callback:触发的回调函数
 * flg:标志捕获还是冒泡
 * */
function bindEvent(dom, event_name, keyCodeArr, callback, flg) {
    if (!flg) {
        flg = false;
    }
    if (!keyCodeArr) {
        dom.addEventListener(event_name, callback, flg)
    } else {
        var keyCodeControl = {}

        function keyCodeControlInit() {
            for (var i = 0; i < keyCodeArr.length; i++) {
                keyCodeControl[keyCodeArr[i]] = false;
            }
        }

        function keyCodeControlTrue() {
            var keyCodeControlKeys = Object.keys(keyCodeControl);
            for (var i = 0; i < keyCodeControlKeys.length; i++) {
                if (!keyCodeControl[keyCodeControlKeys[i]]) {
                    return false;
                }
            }
            return true
        }
        keyCodeControlInit()
        // 标识按下
        document.onkeydown = function (e) {
            for (var i = 0; i < keyCodeArr.length; i++) {
                if (e.keyCode == keyCodeArr[i]) {
                    keyCodeControl[e.keyCode] = true;
                }
            }
            var keyCodeControlFlg = keyCodeControlTrue()
            if (keyCodeControlFlg) {
                dom.addEventListener(event_name, callback(e, keyCodeControl), flg)
            }
        }
        // 标志抬起
        document.onkeyup = function (e) {
            for (var i = 0; i < keyCodeArr.length; i++) {
                if (e.keyCode == keyCodeArr[i]) {
                    keyCodeControl[e.keyCode] = false;
                    dom.removeEventListener(event_name, callback, flg)
                }
            }
        }
    }
}

/**
 * 用途:获取目标类型
 * target:传入的目标
 * 返回：字符串（目标类型）
 * */
function getTargetType(target) {
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
 * 用途:正则匹配全部更改
 * s1:正则表达式
 * s2:替换的字符串
 * 返回：替换后的字符串
 * */
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gmi"), s2);
}

/**
 * 用途:深度比较对象  前对象属性及属性值在后对象中含有并相同
 * original:原对象
 * target:目标对象
 * 返回：{flag:是否匹配正确,msg:信息}
 * */
function compareObjDeep(original, target) {
    function returnFun(flag, data) {
        return {
            flag: flag,
            msg: {
                info: data.info,
                org: data.org,
                target: data.target
            }
        }
    }

    function arrayRecursion(a, b) {
        if (a.length != b.length) {
            return {
                flag: false,
                msg: "数组长度不同"
            };
        }
        for (var j = 0; j < a.length; j++) {
            var aType = getTargetType(a[j]);
            var bType = getTargetType(b[j]);
            if (aType != bType) {
                return returnFun(false, {
                    info: "目标对象与原对象的值类型不同",
                    org: a[j],
                    target: b[j]
                })
            } else if (nextOrginType == "[object Object]") {
                var next = compareObjDeep(a[j], b[j]);
                if (!(next.flag)) {
                    return returnFun(false, {
                        info: next.msg.info,
                        org: next.msg.org,
                        target: next.msg.target
                    })
                }
            } else if (a[j] == "[object Array]") {
                return arrayRecursion(originValue[j], targetValue[j])
            } else {
                if (a[j] != b[j]) {
                    return returnFun(false, {
                        info: "数据不相等",
                        org: a[j],
                        target: b[j]
                    })
                }
            }
        }
        return returnFun(true, {
            info: "原数据在目标数据中都包含",
            org: original,
            target: target
        })
    }
    if (getTargetType(target) != "[object Object]" || getTargetType(original) != "[object Object]") {
        return false;
    }
    var originalKeys = Object.keys(original);
    for (var i = 0; i < originalKeys.length; i++) {
        if (target[originalKeys[i]] != undefined) {
            var originValue = original[originalKeys[i]];
            var targetValue = target[originalKeys[i]];
            var originValueType = getTargetType(originValue);
            var targetValueType = getTargetType(targetValue);
            if (originValueType != targetValueType) {
                return returnFun(false, {
                    info: "目标对象与原对象的值类型不同",
                    org: originValue,
                    target: targetValue
                })
            }
            switch (targetValueType) {
                case "[object Object]":
                    var next = compareObjDeep(originValue, targetValue)
                    if (!(next.flag)) {
                        return returnFun(false, {
                            info: next.msg.info,
                            org: next.msg.org,
                            target: next.msg.target
                        })
                    }
                    break;
                case "[object Array]":
                    if (originValue.length != targetValue.length) {
                        return returnFun(false, {
                            info: "目标对象与原对象的值数组长度不同",
                            org: originValue.length,
                            target: targetValue.length
                        })
                    }
                    for (var j = 0; j < originValue.length; j++) {
                        var nextOrginType = getTargetType(originValue[j]);
                        var targetOrginType = getTargetType(targetValue[j]);
                        if (nextOrginType != targetOrginType) {
                            return returnFun(false, {
                                info: "目标对象与原对象的值类型不同",
                                org: originValue[j],
                                target: targetValue[j]
                            })
                        } else if (nextOrginType == "[object Object]") {
                            var next = compareObjDeep(originValue[j], targetValue[j]);
                            if (!(next.flag)) {
                                return returnFun(false, {
                                    info: next.msg.info,
                                    org: next.msg.org,
                                    target: next.msg.target
                                })
                            }
                        } else if (nextOrginType == "[object Array]") {
                            var next = arrayRecursion(originValue[j], targetValue[j])
                            if (!(next.flag)) {
                                return returnFun(false, {
                                    info: next.msg.info,
                                    org: next.msg.org,
                                    target: next.msg.target
                                })
                            }
                        } else {
                            if (originValue[j] != targetValue[j]) {
                                return returnFun(false, {
                                    info: "数据不相等",
                                    org: originValue[j],
                                    target: targetValue[j]
                                })
                            }
                        }
                    }
                    break;
                default:
                    if (originValue != targetValue) {
                        return returnFun(false, {
                            info: "数据不相等",
                            org: originValue,
                            target: targetValue
                        })
                    }
            }
        } else {
            return returnFun(false, {
                info: "目标对象不存在" + originalKeys[i] + "属性",
                org: originalKeys[i],
                target: originalKeys[i]
            })
        }
    }
    return returnFun(true, {
        info: "原数据在目标数据中都包含",
        org: original,
        target: target
    })
}


/**
 * 用途:深度比较对象是否完全相同
 * original:原对象
 * target:目标对象
 * 返回：{flag:是否匹配正确,msg:信息}
 * */
function compareObjDeepEqual(original, target) {
    function returnFun(flag, data) {
        return {
            flag: flag,
            msg: {
                info: data.info,
                org: data.org,
                target: data.target
            }
        }
    }

    function arrayRecursion(a, b) {
        if (a.length != b.length) {
            return {
                flag: false,
                msg: "数组长度不同"
            };
        }
        for (var j = 0; j < a.length; j++) {
            var aType = getTargetType(a[j]);
            var bType = getTargetType(b[j]);
            if (aType != bType) {
                return returnFun(false, {
                    info: "目标对象与原对象的值类型不同",
                    org: a[j],
                    target: b[j]
                })
            } else if (nextOrginType == "[object Object]") {
                var next = compareObjDeepEqual(a[j], b[j]);
                if (!(next.flag)) {
                    return returnFun(false, {
                        info: next.msg.info,
                        org: next.msg.org,
                        target: next.msg.target
                    })
                }
            } else if (a[j] == "[object Array]") {
                return arrayRecursion(originValue[j], targetValue[j])
            } else {
                if (a[j] != b[j]) {
                    return returnFun(false, {
                        info: "数据不相等",
                        org: a[j],
                        target: b[j]
                    })
                }
            }
        }
        return returnFun(true, {
            info: "原数据在目标数据中都包含",
            org: original,
            target: target
        })
    }
    if (getTargetType(target) != "[object Object]" || getTargetType(original) != "[object Object]") {
        return false;
    }
    var originalKeys = Object.keys(original);
    var targetKeys = Object.keys(target);
    if (originalKeys.length != targetKeys.length) {
        return returnFun(false, {
            info: "目标对象与原对象的属性总数不同",
            org: original,
            target: target
        })
    }
    for (var i = 0; i < originalKeys.length; i++) {
        if (target[originalKeys[i]] != undefined) {
            var originValue = original[originalKeys[i]];
            var targetValue = target[originalKeys[i]];
            var originValueType = getTargetType(originValue);
            var targetValueType = getTargetType(targetValue);
            if (originValueType != targetValueType) {
                return returnFun(false, {
                    info: "目标对象与原对象的值类型不同",
                    org: originValue,
                    target: targetValue
                })
            }
            switch (targetValueType) {
                case "[object Object]":
                    var next = compareObjDeepEqual(originValue, targetValue)
                    if (!(next.flag)) {
                        return returnFun(false, {
                            info: next.msg.info,
                            org: next.msg.org,
                            target: next.msg.target
                        })
                    }
                    break;
                case "[object Array]":
                    if (originValue.length != targetValue.length) {
                        return returnFun(false, {
                            info: "目标对象与原对象的值数组长度不同",
                            org: originValue.length,
                            target: targetValue.length
                        })
                    }
                    for (var j = 0; j < originValue.length; j++) {
                        var nextOrginType = getTargetType(originValue[j]);
                        var targetOrginType = getTargetType(targetValue[j]);
                        if (nextOrginType != targetOrginType) {
                            return returnFun(false, {
                                info: "目标对象与原对象的值类型不同",
                                org: originValue[j],
                                target: targetValue[j]
                            })
                        } else if (nextOrginType == "[object Object]") {
                            var next = compareObjDeepEqual(originValue[j], targetValue[j]);
                            if (!(next.flag)) {
                                return returnFun(false, {
                                    info: next.msg.info,
                                    org: next.msg.org,
                                    target: next.msg.target
                                })
                            }
                        } else if (nextOrginType == "[object Array]") {
                            var next = arrayRecursion(originValue[j], targetValue[j])
                            if (!(next.flag)) {
                                return returnFun(false, {
                                    info: next.msg.info,
                                    org: next.msg.org,
                                    target: next.msg.target
                                })
                            }
                        } else {
                            if (originValue[j] != targetValue[j]) {
                                return returnFun(false, {
                                    info: "数据不相等",
                                    org: originValue[j],
                                    target: targetValue[j]
                                })
                            }
                        }
                    }
                    break;
                default:
                    if (originValue != targetValue) {
                        return returnFun(false, {
                            info: "数据不相等",
                            org: originValue,
                            target: targetValue
                        })
                    }
            }
        } else {
            return returnFun(false, {
                info: "目标对象不存在" + originalKeys[i] + "属性",
                org: originalKeys[i],
                target: originalKeys[i]
            })
        }
    }
    return returnFun(true, {
        info: "两个对象完全相同",
        org: original,
        target: target
    })
}

/**
 * 用途:返回格式化后的日期
 * format:yyyy/MM/dd
 * 返回：格式化后的日期字符串
 * */
// 日期格式化
Date.prototype.format = function (format) {
    var args = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var i in args) {
        var n = args[i];
        if (new RegExp("(" + i + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
    }
    return format;
};

/**
 * 用途:判断是否是数字
 * number:数字字符串
 * 返回：是否为数组
 * */
// 判断是否是数字 -- 判断字符串中是否有科学计数法，e...
function isNumberByNaN(number) {
    var numberIs = Number(number);
    if (numberIs == "NaN") {
        return false;
    }
    if (!isNaN(numberIs)) {
        return true;
    }
    return false;
}

/**
 * 用途:判断是否是数字
 * number:数字字符串
 * 返回：是否为数组
 * */
// 判断是否是数字 -- 字符串严格判断
function isNumberByRegex(number) {
    if (/^[0-9]*$/.test(number)) {
        return true;
    }
    return false;
}

/**
 * 用途:正则匹配所有的数据
 * pattern:正则表达式 元组 /trade\/(\d+)\.do/g
 * inputStr:匹配字符串
 * 返回：匹配的数组
 * */
// 正则匹配所有的数据
function getAllDataByRegex(pattern, inputStr) {
    var arr = [];
    var result;
    while ((result = pattern.exec(inputStr)) != null) {
        arr.push(result[1])
    }
    return arr;
}

/**
 * 用途:获取数字大写
 * num:数字
 * 返回：大写金额字符串
 * */
function getChineseMoney(num) {
    // 数字转中文金额大写
    function transferNumberChineseCharacters(number) {
        if (/[0-9]/.test(number)) {
            switch (number) {
                case 0:
                    return "零";
                case 1:
                    return "壹";
                case 2:
                    return "贰";
                case 3:
                    return "叁";
                case 4:
                    return "肆";
                case 5:
                    return "伍"
                case 6:
                    return "陆"
                case 7:
                    return "柒"
                case 8:
                    return "捌"
                default:
                    return "玖"
            }
        } else {
            throw new Error("transferNumberChineseCharacters: " + number + " is not in [0-9]")
        }
    }
    // 获取层级
    function getUnityByNumber(offset) {
        if (isNumberByRegex(offset)) {
            switch (offset) {
                case 0:
                    return "元";
                case 1:
                    return "拾";
                case 2:
                    return "佰";
                case 3:
                    return "仟"
                case 4:
                    return "万"
                case 5:
                    return "拾"
                case 6:
                    return "佰"
                case 7:
                    return "仟"
                case 8:
                    return "亿"
                case 9:
                    return "拾"
                case 10:
                    return "佰"
                case 11:
                    return "仟"
                case 12:
                    return "万"
                default:
                    throw new Error("it is too big")
            }
        } else {
            throw new Error("getUnityByNumber: " + offset + " is not Number")
        }
    }
    var money = "";
    var offset = 0;
    if (isNumberByRegex(num)) {
        if (num == 0) {
            return "零"
        }
        var numStr = (num + "");
        for (var i = numStr.length - 1; i >= 0; i--) {
            if (offset == 0 && numStr[i] == 0) {
                money = "元"
            }
            if (numStr[i] != 0) {
                var unity = getUnityByNumber(offset)
                var chineseCharater = transferNumberChineseCharacters(parseInt(numStr[i]))
                money = chineseCharater + unity + money;
            }
            if (offset == 3 && numStr[i] == 0) {
                money = "零" + money;
            }
            if (offset == 4 && numStr[i] == 0) {
                money = "万" + money;
            }
            if (offset == 7 && numStr[i] == 0) {
                money = "零" + money;
            }
            if (offset == 8 && numStr[i] == 0) {
                money = "亿" + money;
            }
            offset++
        }
    }
    return money + "整";
}

/*
 * formatMoney(s)
 * 功能：金额按千位逗号分割
 * 参数：s，需要格式化的金额数值.
 * 返回：返回格式化后的数值字符串.
 */
function formatMoney(s) {
    let s_ = ""
    // 表示为负数
    if (s.includes("-")) {
        s_ = "-"
        s = s.replace(/\-/g, "")
    }
    if (/[^0-9\.]/.test(s))
        return s;
    if (s == null || s == "")
        return s;
    s = s.toString().replace(/^(\d*)$/, "$1.");
    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    s = s.replace(".", ",");
    var re = /(\d)(\d{3},)/;
    while (re.test(s))
        s = s.replace(re, "$1,$2");
    s = s.replace(/,(\d\d)$/, ".$1");
    return s_ + s;
}

/**
 * 功能: 获取元素属性值
 * 参数: prop 属性
 * 
*/
HTMLElement.prototype.getStyle = function (prop) {
    if (!prop) {
        return window.getComputedStyle(this, null) || this.currentStyle
    }
    if (window.getComputedStyle) {
        return window.getComputedStyle(this, null)[prop]
    } else {
        return this.currentStyle[prop];
    }
}

/**
 * 功能: 以下函数返回 min（包含）～ max（包含）之间的数字：
 * min  起始
 * max  终止
 * [min,max]
*/
function getRndInteger(min, max) {
    return (Math.random() * (max - min + 1) | 0) + min;
}
/**
 * 功能：在pivot之后插入节点 newNpde
 * newNode: 新节点
 * pivot: 标杆节点
 */
Element.prototype.insertAfter = function (newNode, pivot) {
    var nextElement = pivot.nextElementSibling
    if (nextElement) {
        this.insertBefore(newNode, nextElement)
    } else {
        this.appendChild(newNode)
    }
}

/**
 **功能：判断传入的是不是空对象，空数组，空串。。。
 * */
function isNotEmpty(params) {
    switch (getTargetType(params)) {
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
