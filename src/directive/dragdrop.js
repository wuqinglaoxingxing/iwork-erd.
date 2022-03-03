/**
 * 功能描述：拖拽弹框
 * 使用场景：对提示框、授权框添加拖拽效果
 * 用法：v-dragdrop,取消拖拽：v-dragdrop:colse
 * 高级用法：更改弹框位置  
 *          v-dragdrop = "costmoStyle"
 *          costmoStyle :{
                left: "15%",
                top:"0",
                transform:"none"
            }
 * 杨哲 2019/09/12
 */

import xhtml from '@/service/xhtml';
import Vue from 'vue';
Vue.directive("dragdrop", {
    bind: function (el, binding) {
        // 获取transformX Y
        let tFs = null
        // 拖拽区域差值
        let sElHeight = null
        // 增加移动样式
        el.style.cursor = "move";
        //取消拖拽
        if (binding.arg == 'close') return;

        //绑定鼠标左键按下事件
        xhtml.bind(el, 'mousedown', function mousedown(event) {
            //解决浏览器全选无法拖拽弹框    
            el.setCapture && el.setCapture();

            // 最大高度，宽度
            const view = document.querySelector("div.view.shade")
            let maxWidth = ""
            let maxHeight = ""
            // 处理有无遮掩层
            if (view) {
                maxWidth = xhtml.getStyle(view, "width").replace('px', '')
                maxHeight = xhtml.getStyle(view, "height").replace('px', '')
            } else {
                maxWidth = document.body.clientWidth
                maxHeight = document.body.clientHeight
            }


            if (!sElHeight) {
                sElHeight = el.clientHeight
            }

            // 目前寻找的是view
            while (el.parentNode && el.getAttribute('defType') != 'dialogFrame') {
                el = el.parentNode;
            }
            // 拖拽区域差值
            const elWidth = el.clientWidth

            let lf = event.clientX;
            let tp = event.clientY;
            // 默认居中
            let left = isNotEmpty(el.style.left) && el.style.left.includes("px") ? (el.style.left).replace('px', '') : xhtml.getStyle(el, "left").replace('px', '');
            let top = isNotEmpty(el.style.top) && el.style.top.includes("px") ? (el.style.top).replace('px', '') : xhtml.getStyle(el, "top").replace('px', '');
            //绑定鼠标移动事件
            function mousemove(event) {
                let transform = xhtml.getStyle(el, "transform")
                tFs = transform.replace(/matrix\(1\, 0\, 0\, 1\, (.+)?\, (.+)?\)/, function ($, $1, $2) {
                    return [$1, $2]
                })
                // 默认居中 -- 自定义情况为0,0
                const [edgeLeft, edgeTop] = tFs.includes(",") ? tFs.split(",") : "0,0".split(",")
                let currentLeft = left - - event.clientX - lf
                let currentTop = top - - event.clientY - tp
                // 保证移不出去
                let topFlg = currentTop >= Math.abs(edgeTop) && currentTop + sElHeight - Math.abs(edgeTop) <= Math.abs(maxHeight)
                let leftFlg = currentLeft >= Math.abs(edgeLeft) && currentLeft + elWidth - Math.abs(edgeLeft) <= Math.abs(maxWidth)
                if (topFlg && leftFlg) {
                    el.style.top = currentTop + 'px';
                    el.style.left = currentLeft + 'px';
                } else if (topFlg) {
                    el.style.top = currentTop + 'px';
                    if (currentLeft < Math.abs(edgeLeft)) {
                        el.style.left = -edgeLeft + 'px';
                    } else {
                        el.style.left = Math.abs(maxWidth) - elWidth + Math.abs(edgeLeft) + "px"
                    }
                } else if (leftFlg) {
                    el.style.left = currentLeft + 'px';
                    if (currentTop < Math.abs(edgeTop)) {
                        el.style.top = - edgeTop + 'px';
                    } else {
                        el.style.top = Math.abs(maxHeight) - sElHeight + Math.abs(edgeTop) + "px"
                    }
                }
            }
            xhtml.bind(document, 'mousemove', mousemove);

            //绑定鼠标松开事件,清除鼠标移动绑定
            xhtml.bind(document, 'mouseup', function (event) {
                xhtml.unbind(document, 'mousemove', mousemove);
                el.releaseCapture && el.releaseCapture();
                return false;
            });
        });
    },
    inserted: function (el, binding) {
        // 目前寻找的是view
        while (el.parentNode && el.getAttribute('defType') != 'dialogFrame') {
            el = el.parentNode;
        }
        if (el.getAttribute && el.getAttribute('defType') === 'dialogFrame') {
            el.classList.add("dragdrop")
            // 自定义位置样式
            if (binding.value && typeof binding.value == "object") {
                Object.keys(binding.value).forEach(key => {
                    el.style[key] = binding.value[key]
                })
            }
        }
    }
})
