const preCompiler = require('./preCompiler');

/**
 * webpack自定义插件
 * 用于在打包的各个阶段触发必要的处理事件
 */
const pluginName = 'taskLoaderPlugin';

const fs = require('fs');

class taskLoaderPlugin {
    apply(compiler) {

        // 每次编译前调用
        compiler.hooks.make.tap(pluginName, compilation => {
            preCompiler();
        });

    }
}

module.exports = taskLoaderPlugin;
