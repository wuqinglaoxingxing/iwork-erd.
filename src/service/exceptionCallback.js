// 显示更详细错误信息方法
export let ExceptionCallbackService_default = (data, status, headers, config, oralConfig) => {
    if (data.__proto__.constructor == Blob) {
        let reader = new FileReader();
        reader.onload = function (event) {
            let content = reader.result; //内容就在这里
            vm.alert(JSON.parse(content).message);
        };
        reader.readAsText(data);
    } else {
        if (data.responseMsg) {
            vm.alert(data.responseMsg);
        } else if (data.message) {
            vm.alert(data.message);
        } else {
            vm.alert(data.ERRMSG || "请求出错");
        }
    }
};


// 需要重新登录
export let ExceptionCallbackService_500 = (data, status, headers, config, oralConfig) => {
    // 默认错误提示
    ExceptionCallbackService_default(data, status, headers, config);
};



// 需要重新登录
export let ExceptionCallbackService_504 = (data, status, headers, config, oralConfig) => {
    // 默认错误提示
    ExceptionCallbackService_default(data, status, headers, config);
};


// 需要重新登录
export let ExceptionCallbackService_518 = (data, status, headers, config, oralConfig) => {
    // 默认错误提示
    ExceptionCallbackService_default(data, status, headers, config);
};

export let ExceptionCallbackService_520 = (data, status, headers, config, oralConfig) => {

    // 默认错误提示
    ExceptionCallbackService_default(data, status, headers, config);

};
