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
        rules: [{
            test: /\.(css|scss)$/,
            use: ['vue-style-loader','css-loader', 'postcss-loader', 'sass-loader']
        },{
            test: /\.(png|jpg|jpeg|gif|bmp)$/,
            use: [{
                loader: "url-loader",
                options: {
                    publicPath: "../source",
                    name: "build/[path][name].[ext]",
                    context: "src/asset",
                    limit: 5000
                }
            }]
        }]
    },
});
