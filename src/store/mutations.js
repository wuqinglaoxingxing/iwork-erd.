export default {

    //  打开弹框
    openDialog: function (state, value) {
        const { id, initdata, callback, noShade } = value;
        if (typeof callback == 'boolean') {
            noShade = callback;
            callback = undefined;
        }
        state.dialogs.push({
            id: id,
            data: initdata,
            callback: callback,
            shade: noShade || false
        });
    },

    //  关闭弹框
    closeDialog: function (state,data) {
        let will_close_dialog = {}
        // 表示存在指定关闭
        if (data && data.id) {
            let idx = state.dialogs.findIndex(dialog => {
                return dialog.id === data.id
            })
            will_close_dialog = state.dialogs[idx]
            state.dialogs.splice(idx, 1)
        } else {
            // 从数组中删除即可关闭
            will_close_dialog = state.dialogs.pop();
        }
        // 如果有回调，回调
        if (typeof will_close_dialog.callback === "function") {
            will_close_dialog.callback(data);
        }
    }

}