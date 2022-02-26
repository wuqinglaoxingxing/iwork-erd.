const merge = require("webpack-merge");
const common = require("./webpack.config.js");
const webpack = require("webpack");

module.exports = merge(common, {
    devtool: "inline-source-map",
    devServer: {
        contentBase: "./",
        compress: false,
        host: "127.0.0.1",
        port: "46000",
        hot: true,
        inline: true,
        historyApiFallback: true,
        proxy: {
            // 普通ajax请求
            // "/devServer/": {
            //     target: "http://61.155.2.142:5824/", // sit2
            //     changeOrigin: true,
            //     pathRewrite: { "^/devServer": "/" },
            //     secure: false
            // },
            // // websocket请求配置 
            // '/websocket': {
            //     target: "ws://61.155.2.142:5824/", //sit2
            //     ws: true,
            //     secure: false,
            //     changeOrigin: true,
            //     onProxyReqWs: (proxyReq, req, socket, options, head) => {
            //         socket.on('error', function (err) {
            //             console.warn("Socket error using onProxyReqWs event", err)
            //         })
            //    }
            // }
        },
        disableHostCheck: true,
        watchOptions: {
            poll: true,
            ignored: /node_modules/,
            aggregateTimeout: 300
        }
    },
    module: {
        rules: [{
            test: /\.(css|scss)$/,
            use: ['vue-style-loader?sourceMap', 'css-loader?sourceMap', 'postcss-loader?sourceMap', 'sass-loader?sourceMap']
        },{
            test: /\.(png|jpg|jpeg|gif|bmp)$/,
            use: [{
                loader: "url-loader",
                options: {
                    publicPath: "../",
                    name: "build/[path][name].[ext]",
                    context: "src/asset",
                    limit: 5000
                }
            }]
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ],
    mode: "development"
});
