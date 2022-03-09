import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// 引入首页
import home from './views/home.vue';

// 懒加载路由
const main = () => import('./views/main.vue')

// 配置路由
const router = new VueRouter({
    mode: 'history',
    routes: [{
            // 登录
            path: '/home',
            component: home
        },
        {

            // 交易主界面
            path: '/workbench',
            component: main
        },
        {
            path: '/*',
            redirect: 'home'
        }
    ]
});

export default router;
