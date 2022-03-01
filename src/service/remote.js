
/**
 * xhr请求
 */
import axios from "axios";
import _ from "lodash";
import config from './config';

let commonConfig = {

    // 超时时间
    timeout: config.timeout,

    // 请求头
    headers: config.headers,

    // 请求上下文
    baseURL: config.baseURL,
    
    //错误弹框
    errorAlert:config.errorAlert,
};

//发送请求拦截
axios.interceptors.request.use(
    // 成功
    config.requestBack,
    // 失败
    config.requestErrorBack
);
// 导出方法提供给项目使用
export default {
    install(Vue) {
        Vue.prototype.$remote = {

            // GET请求
            /*
            this.get(url)
            this.get(url,callback)
            this.get(url,callback,errorback)
            this.get(url,callback,conf)
            this.get(url,callback,errorback,conf)
             */
            "get": (url, callback, errorback, conf) => {

                // 参数校对
                if (typeof errorback !== 'function') conf = errorback;


                let params = {};

                //分割url,获取上送的参数
                var tempArray = url.split('?');
                var temp2Array = tempArray.length == 1 ? [] : tempArray[1].split('&');
                temp2Array.map((item) => { return params[item.split('=')[0]] = item.split('=')[1] })
                url = tempArray[0];

                let _config = {};
                Object.assign(_config, commonConfig, conf);

                // 设置params
                _config.params = params

                axios.get(url, _config).then((response) => {

                    if (typeof callback !== 'function' || !callback(response))
                        config.responseBack(response, callback, errorback, conf);

                }).catch((error) => {

                    if (typeof errorback !== 'function' || !errorback(error))
                        config.responseErrorBack(error, callback, errorback, conf);

                });
            },

            // POST请求
            /*
            this.post(url)
            this.post(url,params)
            this.post(url,params,callback)
            this.post(url,params,callback,errorback)
            this.post(url,params,callback,conf)
            this.post(url,params,callback,errorback,conf)
            */
            "post": async (url, params, callback, errorback, conf) => {
                // 参数校对
                if (typeof errorback !== 'function') conf = errorback;

                // 如果为FormData 则直接发送
                if (params instanceof FormData) {
                    send()
                    return
                }

                params = _.cloneDeep(params);

                let _config = {};
                Object.assign(_config, commonConfig, conf);

                send()

                function send() {
                    axios.post(url, params || {}, _config).then((response) => {
                        // 如果没有默认回调或者有默认回调，可是返回false
                        // 这是为了方便交易中的回调可以控制公共回调是否执行
                        if (typeof callback !== 'function' || !callback(response))
                            config.responseBack(response, callback, errorback);

                    }).catch((error) => {
                        if (_config.errorAlert){
                            config.responseErrorBack(error, callback, errorback);
                        }
                        typeof errorback === 'function' && errorback(error)

                    });
                }
            }
        };
    }
};
