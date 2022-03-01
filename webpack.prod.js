const merge = require('webpack-merge');
const common = require('./webpack.config.js');
// 自动生成html
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 拷贝文件
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
    mode: "production",
    devtool: "source-map",
    module: {
    },
});
