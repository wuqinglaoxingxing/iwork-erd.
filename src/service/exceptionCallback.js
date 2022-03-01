// 显示更详细错误信息方法
export let ExceptionCallbackService_default = (data, status, headers, config, oralConfig) => {
    if(data.__proto__.constructor==Blob){
        let reader = new FileReader();
        reader.onload = function(event){
            let content = reader.result;//内容就在这里
            vm.alert(JSON.parse(content).message);
        };
        reader.readAsText(data);
    }else{
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
export let ExceptionCallbackService_518 = (data, status, headers, config, oralConfig) => {
    vm.alert(`
        模块：BMP<br />
        错误码：系统错误<br />
        错误信息：页面已失效，请重新登录！
    `, "错误提示", function () {
        vm.$router.push({
            path: "/login"
        });
    });
};

// 授权，收费等特殊处理
export let ExceptionCallbackService_520 = (data, status, headers, config, oralConfig) => {

    /**
     * 复核中的经办
     * -----------------------
     */
    if (data.FORWARD === "RECHECK") {
        vm.alert("交易已提交，请等待复核..<br>复核号：" + data.RECHECK.checkNo, '提示', exitTrade);
    }

    /**
     * 流程
     */
    else if (data.FORWARD === "FLOW") {
        // 获取当前激活的交易
        const aTrade = document.querySelector("div.trade-view.active")
        const uniqueId = aTrade.getAttribute("unique-id")
        const targetScope =  vm.$store.state.tradeInstance[uniqueId]
        let tipMessage = "流程提交成功！";
        vm.alert(tipMessage, "提示", function () {
            targetScope.$parent.closePage?targetScope.$parent.closePage(uniqueId,"flowSuccess") : targetScope.$parent.$parent.closePage(uniqueId,"flowSuccess");
        });
    }
    /**
     * 明细授权
     */
    else if (data.FORWARD === "AUTHCA") {
        let result = data.AUTHCA;
        //若是含有warninfo信息，则直接弹窗，不进行重复授权
        let authcaWarninfo;
        if (result.warninfo) {
            // $state.authcaWarninfo = result.warninfo;
            authcaWarninfo= result.warninfo;
        }

        let authInfo = {};
        authInfo.details = result;
        authInfo.authUrl = config.url;
        authInfo.params = config.data;
        authInfo.successFn = function (dat) {
            config.successcall(dat);
            $state.closeDialog('false');
        };
        //打开明细授权框
        $state.openDialog("authcaiInfo",{"authcaWarninfo":authcaWarninfo,"authInfo":authInfo},function(data){})
    }

    // 默认错误提示
    else {
        ExceptionCallbackService_default(data, status, headers, config);
    }
};