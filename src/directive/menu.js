/**
 * 左侧菜单
 * 使用方法：
 * v-menu="[openPage,stateMenuList,stateMenuShow,$store.state.language]"
 */
import Slider from "@/service/slider";
import Vue from 'vue';
import xhtml from '@/service/xhtml';

const animationTimer = 300; //动画时间
const defaultUnfold = true; // 默认全部不打开菜单
const isChild = "children"
const openFlg = "template"
const lang = {
    id: "zh-CN",
    name: "中国",
    pos: {
        backgroundPosition: "-1049px 0",
    },
    code: "+84",
};

// 判断菜单是否符合要求 -- 数组判断
let menuTypeJudge = function (menuList) {
    const isArray = vm.getTargetType(menuList) === "[object Array]"
    return isArray && menuList.length
}
/**
 * menuList:菜单数据
 * pNode:父级节点
 * level:层级
 * */
let createMenu = function (nav, menuList, pNode, level, className) {
    // 创建包裹层
    const ul = document.createElement("ul")
    ul.setAttribute("deep", level)
    // 两种菜单
    if (className) {
        ul.classList.add(className)
        ul.style.display = defaultUnfold &&
            ((nav.$menuShow && className === "maxUl") || (!nav.$menuShow && className === "minUl")) ? "block" : "none"
    }
    menuList.forEach(menu => {
        const isChildFlg = Reflect.has(menu, isChild) && menuTypeJudge(menu[isChild])
        const menuItem = createItem(menu, level, isChildFlg)
        // 表示有子集
        if (isChildFlg) {
            const isArray = menuTypeJudge(menu[isChild])
            if (isArray) {
                // 不是第一层菜单进行两种菜单生成
                if (className === "maxUl") {
                    const ulC1 = createMenu(nav, menu[isChild], menuItem, level + 1, "maxUl")
                    menuItem.appendChild(ulC1)
                } else if (className === "minUl") {
                    const ulC2 = createMenu(nav, menu[isChild], menuItem, level + 1, "minUl")
                    menuItem.appendChild(ulC2)
                } else {
                    const ulC1 = createMenu(nav, menu[isChild], menuItem, level + 1, "maxUl")
                    const ulC2 = createMenu(nav, menu[isChild], menuItem, level + 1, "minUl")
                    menuItem.appendChild(ulC1)
                    menuItem.appendChild(ulC2)
                }
            }
        }
        ul.appendChild(menuItem)
        // 设置方法--em
        setEmEventHandler(nav, menuItem, menu)
    });
    return ul
}
/**
 * 创建元素
 * */
let createItem = function (data, level, isChildFlg) {
    const li = document.createElement("li")
    const em = document.createElement("em")
    const span = document.createElement("span")
    const i = document.createElement("i")
    em.setAttribute("level", level)
    em.setAttribute("menuid",data.menuid)
    // 只是针对第一层
    if (level === 1) {
        // 设置图片
        em.setAttribute("image", data.imagesrc)
        em.setAttribute("isroot", "yes")
    } else {
        em.setAttribute("isroot", "no")
    }
    span.innerText = data.menuname
    em.appendChild(span)
    // 只有children的才有箭头
    if (isChildFlg) {
        em.appendChild(i)
    }
    // 判断是否为打开菜单
    if (Reflect.has(data, openFlg) && data[openFlg]) {
        em.setAttribute("template", data[openFlg])
    }
    li.appendChild(em)
    return li
}

/**
 * 设置方法
 * */
let setEmEventHandler = function (nav, li, data) {
    // 针对em设置
    const em = li.querySelector("em")
    // 判断是否为打开菜单
    const template = em.getAttribute("template")
    if (!template && menuTypeJudge(data[isChild])) {
        em.classList.add(defaultUnfold ? "active" : "")
    }
    // 设置默认open
    em.parentNode.setAttribute("isopen", defaultUnfold ? "yes" : "no")
    em.addEventListener("click", function (event) {
        event.stopPropagation();
        const nodes = this.parentNode.childNodes
        // 针对不同的菜单进行处理
        let uls = Array.from(nodes).filter(node => {
            return (nav.$menuShow && node.classList.contains("maxUl") && node.tagName.toLowerCase() === "ul") ||
                (!nav.$menuShow && node.classList.contains("minUl") && node.tagName.toLowerCase() === "ul")

        })
        // 针对于min 打开菜单需要将其他显示菜单隐藏
        if (!nav.$menuShow) {
            hideMinMenuBefore(nav, this)
        }
        Array.from(uls).forEach(ul => {
            if (ul.style.display === "none") {
                Slider.slideDown(ul, animationTimer);
                // 设置li-open
                this.parentNode.setAttribute("isopen", "yes")
                if (!template) {
                    this.classList.add("active")
                }
            } else {
                Slider.slideUp(ul, animationTimer);
                // 设置li-open
                this.parentNode.setAttribute("isopen", "no")
                if (!template) {
                    this.classList.remove("active")
                }
            }
        })
        if (template) {
            // 将两个菜单都取消高亮
            const beforeLights = nav.querySelectorAll(".highlight")
            Array.from(beforeLights).forEach((beforeLight) => {
                beforeLight.classList.remove("highlight");
            });
            // 将两个菜单都高亮
            const menuid = this.getAttribute("menuid")
            const ems = nav.querySelectorAll(`em[menuid='${menuid}']`)
            Array.from(ems).forEach((em) => {
                em.parentNode.classList.add("highlight");
            });
            if (!nav.$menuShow) {
                hideView(nav)
            }
            openPage(nav, data)
        }
    })
}

/**
 * 创建 menuSwitch
 * */
let createMenuSwitch = function (pNode) {
    let switchNode = pNode.querySelector(".menuSwitch")
    if (!switchNode) {
        switchNode = document.createElement("div")
        switchNode.classList.add("menuSwitch")
        switchNode.addEventListener('click', function (event) {
            const menuShow = vm.$store.getters.stateMenuShow
            // 设置值
            vm.$store.commit("changeStateByKey", {
                key: "menuShow",
                value: !menuShow
            })
            if (!menuShow) {
                switchNode.classList.remove("menuSwitch_t")
            } else {
                switchNode.classList.add("menuSwitch_t")
            }
            // 隐藏max视图
            hideView(pNode)
            pNode.$menuShow = !menuShow
        })
    }
    return switchNode
}

// 针对于min 打开菜单需要将其他显示菜单隐藏
let hideMinMenuBefore = function (pNode, em) {
    /**
     * 是否点击的就是当前active
     * 平级ative隐藏
     */
    // 点击的就是当前active
    if (em.classList.contains("active")) {
        return
    }
    let level = parseInt(em.getAttribute("level"))
    // 去除所有em active
    const ems = pNode.querySelectorAll(`em[level='${level}'].active`)
    Array.from(ems).forEach(em => {
        em.classList.remove("active")
    })
    // 针对大于level的进行隐藏
    while (level) {
        let minUls = pNode.querySelectorAll(`ul.minUl[deep='${level+1}']`)
        if (minUls && minUls.length) {
            Array.from(minUls).forEach(ul => {
                ul.style.display = "none"
            })
            level++
        } else {
            return
        }
    }
}

// 隐藏 视图
let hideView = function (pNode) {
    // 找到所有em.active 关闭
    const ems = pNode.querySelectorAll("em.active")
    Array.from(ems).forEach(em => {
        const nodes = em.parentNode.childNodes
        // 判断是否为打开菜单
        const template = em.getAttribute("template")
        // 针对不同的菜单进行处理
        let uls = Array.from(nodes).filter(node => {
            return node.tagName.toLowerCase() === "ul"
        })
        Array.from(uls).forEach(ul => {
            Slider.slideUp(ul, animationTimer);
            // 设置li-open
            em.parentNode.setAttribute("isopen", "no")
            if (!template) {
                em.classList.remove("active")
            }
        })
        if (template) {
            const beforeLight = nav.querySelector(".highlight")
            beforeLight && beforeLight.classList.remove("highlight")
        }
    })
}

// 打开菜单
let openPage = function (nav, data) {
    let {
        template,
        menuname,
        module,
        menuid
    } = data
    menuname = menuname.replace(/\[.+\]/, '');
    // 默认参数
    let dataStr = template.split('?');
    let menuparams = dataStr[1] && getParams(dataStr[1])
    nav.$openPage && nav.$openPage(menuid, menuname, module, "", menuparams, menuid);
}
// 获取路由默认参数
let getParams = function (params) {
    let dataStrArr = params.split("&")
    let reObj = Object.create(null)
    dataStrArr.forEach(str => {
        const [key, value] = str.split("=")
        reObj[key] = value
    })
    return reObj
}



export default {

    bind: function (el, binding) {

        // 打开交易页面
        el.$openPage = binding.value[0];

        // 菜单
        el.$menuList = binding.value[1];

        // 菜单缩放
        el.$menuShow = binding.value[2];

        // 语言
        let {
            id
        } = binding.value[3] || lang;
        el.$language = id

        let arrType = menuTypeJudge(el.$menuList)
        if (!arrType) {
            return
        }
        // 创建菜单
        const ul = createMenu(el, el.$menuList, el, 1)
        el.appendChild(ul)
        // 创建menuSwitchs
        const switchNode = createMenuSwitch(el)
        el.appendChild(switchNode)

        // 点击其他关闭
        window.addEventListener('click', function (event) {
            if(!event.target.closest('.menu-view')){
                // 点击空白处关闭小菜单弹框
                if (!el.$menuShow) {
                    hideView(el)
                }
            }
        })

    },
    update: function(el, binding){
        // 菜单
        el.$menuList = binding.value[1];
        let arrType = menuTypeJudge(el.$menuList)
        if (!arrType) {
            return
        }
        if(JSON.stringify(el.$menuList)===JSON.stringify(binding.oldValue[1])){
            return
        }
        el.innerHTML = ""
        // 创建菜单
        const ul = createMenu(el, el.$menuList, el, 1)
        el.appendChild(ul)
        // 创建menuSwitchs
        const switchNode = createMenuSwitch(el)
        el.appendChild(switchNode)

    }
}
