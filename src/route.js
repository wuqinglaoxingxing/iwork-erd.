import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// 引入首页
import home from './views/home.vue';

// 懒加载路由
const tradesys = () => import('./views/tradesys.vue')

// 配置路由
const router = new VueRouter({
    routes: [{
            // 登录
            path: '/home',
            component: home
        },
        {

            // 交易主界面
            path: '/tradesys',
            component: tradesys
        },
        {
            path: '/*',
            redirect: 'home'
        }
    ]
});

export default router;
