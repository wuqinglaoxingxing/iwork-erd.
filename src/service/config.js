import {

    // 导入特殊的错误处理方法
    ExceptionCallbackService_default,
    ExceptionCallbackService_500,
    ExceptionCallbackService_504,
    ExceptionCallbackService_520
} from './exceptionCallback';

let config = {

    /**
     * 系统配置
     * ------------------
     */

    // 开发环境：browser|shell
    "$TrsEnvironment": "browser",

    /**
     * $remote请求配置
     * ------------------
     */

    // 超时时间
    "timeout": 10000,

    // 请求头
    "headers": {
        "Content-Type": "application/json;charset=utf-8"
    },

    // 弹出错误弹框
    "errorAlert":true,

    // 请求上下文
    "baseURL": "/erd/",


    // 请求成功拦截
    "requestBack": config => {
        return config;
    },

    // 请求失败拦截
    "requestErrorBack": error => {
        return Promise.reject(error);
    },

    // 响应成功拦截
    "responseBack": (response, callback, errorback) => {
        return Promise.resolve(response);
    },

    // 响应失败拦截
    "responseErrorBack": (error, callback, errorback) => {
        if (error && error.response) {

            // 非xhr部分的自主配置
            let oralConfig = {
                callback,
                errorback
            };

            // 特殊的错误进行拦截处理
            if ([].indexOf(error.response.status) > -1) {
                ExceptionCallbackService_default(error.response.data, error.response.status, error.response.headers, error.response.config, oralConfig);
            } else if (error.response.status == 500) {
                ExceptionCallbackService_500(error.response.data, error.response.status, error.response.headers, error.response.config, oralConfig);
            } else if (error.response.status == 504) {
                ExceptionCallbackService_504(error.response.data, error.response.status, error.response.headers, error.response.config, oralConfig);
            } else if (error.response.status == 520) {
                ExceptionCallbackService_520(error.response.data, error.response.status, error.response.headers, error.response.config, oralConfig);
            }
            // 如果不是特殊的错误，默认提示
            else {
                switch (error.response.status) {
                    case 400:
                        error.message = '请求错误';
                        break
                    case 401:
                        error.message = '未授权，请登录';
                        break
                    case 403:
                        error.message = '拒绝访问';
                        break
                    case 404:
                        error.message = '找不到该地址: ' + error.response.config.url;
                        break
                    case 408:
                        error.message = '请求超时';
                        break
                    case 501:
                        error.message = '服务未实现';
                        break
                    case 502:
                        error.message = '网关错误';
                        break
                    case 503:
                        error.message = '服务不可用';
                        break
                    case 505:
                        error.message = 'HTTP版本不受支持';
                        break
                    default:
                        break
                }

                vm.alert(error.response.data.ERRINF || error.message || "未知错误", error.response.data.ERRMSG || '请求出错');

            }

        } else {
            vm.alert(error.message);
        }

        return Promise.reject(error);
    },

};

export default config;
