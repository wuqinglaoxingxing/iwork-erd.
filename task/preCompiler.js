let banner = `/**
=========================================================
[重要说明]
这里的内容不需要编辑，程序会在必要的时候自动更新
=========================================================
*/

// 你需要在这里注册全部的`;

/**
 * =====================================
 * 预处理脚本
 * 在webpack编译前，需要统一进行的一些预处理操作
 * =====================================
 */

const fs = require('fs');
const path = require('path');

const fullPath = function (pathString, contextPath) {

    if (/^\//.test(pathString) || /^[A-Za-z]:\\/.test(pathString)) {
      // 如果传递的就是全路径
      return pathString;
    }
  
    if (arguments.length <= 1) {
      // 默认把当前命令行作为上下文路径
      contextPath = process.cwd();
    }
  
    // 拼全路径
    return path.join(contextPath, pathString);
  };

/**
 * 加载的交易和弹框由脚步统一生成懒加载配置
 * --------------------------------------
 */

let toLazyLoad = function (sourceDir, targetFile, module_name) {

    let files = fs.readdirSync(sourceDir),
        showFiles = "";

    // 递归解析文件路径
    let getPath = function(path,readyDir){
        let names = [];
        let files = fs.readdirSync(path);
        // 拼接懒加载文件
        files.forEach(function (item) {
            if (/\./.test(item)) {
                if(readyDir){
                    names.push(readyDir+"/"+item)
                }else{
                    names.push(item)
                }
            } else {
                let temps = getPath(path+"/"+item,readyDir+"/"+item)
                for (let i = 0; i < temps.length; i++) {
                    names.push(temps[i]);
                }
            }
        });
        return names;
    }
    let template = banner + module_name + `
export default {
    ` + (function () {

            let temp = "", name;

            // 拼接懒加载文件
            files.forEach(function (item) {
                if (/\.vue$/.test(item)) {
                    name = item.replace(/\.vue$/, "");
                    temp += '\n"' + name + '":() => import("./dialogs/' + name + '.vue"),';
                    showFiles += "\x1B[33m" + name + "\x1B[39m";
                } else if (fs.existsSync(fullPath(item + "/mod.vue", sourceDir))) {
                    temp += '\n"T' + item + '": () => import("./trades/' + item + '/mod.vue"),';
                    showFiles += "\x1B[33m" + item + "\x1B[39m";
                } else {
                    // 针对内层的弹框进行解析
                    if(sourceDir.includes("dialogs")){
                        let paths = getPath(sourceDir+"/"+item,item)
                        paths.forEach(path=>{
                            path.replace(/\/(.*)\.vue$/,function($,$1){
                                temp += '\n"' + $1 + '":() => import("./dialogs/' + path + '"),';
                            })
                        })
                    }
                    showFiles += "\x1B[35m" + item + "\x1B[39m";
                }
                showFiles += " ";
            });

            return temp;

        })() + `

};`;

    let template_old = fs.readFileSync(targetFile);
    if (template_old == template) {
        console.info(module_name + " : 无需更新！");
        return;
    } else {
        console.info(module_name + " : " + showFiles);
        fs.writeFileSync(targetFile, template);
    }

};

/**
 * 加载路径复杂的交易统一生成懒加载配置
 * --------------------------------------
 */

let getDeepPath = function (fullpath, pName) {

    let names = [], files = fs.readdirSync(fullpath);
    // 拼接懒加载文件
    files.forEach(function (item) {
        if (/\.vue$/.test(item)) {
            if ('mod.vue' == item)
                names.push(pName);
        } else if (/\.js$/.test(item)) {
            // todo
        } else {
            let temps = getDeepPath(path.join(fullpath, './' + item), pName + "/" + item);
            for (let i = 0; i < temps.length; i++) {
                names.push(temps[i]);
            }
        }
    });

    return names;
};


module.exports = function () {

    console.error('┏ toLazyLoad ----------------------------\n');

    // 弹框
    toLazyLoad('./src/views/dialogs', './src/views/lazy-load-dialog.js', '弹框');

    // 交易
    toLazyLoad('./src/views/trades', './src/views/lazy-load-trade.js', '交易');

    console.error('\n┗ ---------------------------------------');
};
