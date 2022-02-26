import Vue from 'vue';
import Vuex from 'vuex'

// 兼容文件
import 'promise-polyfill/src/polyfill';
import 'babel-polyfill'
// 动画
import "animate.css"

// 引入启动界面
import App from './App.vue';
// 引入路由文件
import router from './route';
// 引入全局变量
import storeObj from './store';

// 引入主页面样式
import './style/basic/root.scss';
import "./style/polyfill.scss";

Vue.use(Vuex)
const store =  new Vuex.Store(storeObj)

//根对象
window.vm = new Vue({
    // 启用store
    store,
    // 启用路由
    router,
    // 启动vue
    render: h => h(App),
}).$mount('#app')
