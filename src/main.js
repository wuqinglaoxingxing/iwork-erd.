import Vue from 'vue';

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
import Vuex from 'vuex'
import storeObj from './store';
Vue.use(Vuex)
const store =  new Vuex.Store(storeObj)

// 引入页面样式
import './style/basic/root.scss';
import "./style/polyfill.scss";
import './style/iconfont/iconfont.css';
import './style/app.scss';

// 自定义全局指令
import "./directive/dragdrop";

// 引入$remote请求服务
import remote from './service/remote';
Vue.use(remote);

// 引入method服务
import method from './extend/method';
Vue.use(method);


//根对象
window.vm = new Vue({
    // 启用store
    store,
    // 启用路由
    router,
    // 启动vue
    render: h => h(App),
}).$mount('#app')
