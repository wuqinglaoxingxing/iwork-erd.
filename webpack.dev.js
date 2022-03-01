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
            "/erd/": {
                target: "https://www.fastmock.site/mock/b4c1f5e1e23dbbff5c0671dec97d0ef5/", // sit2
                changeOrigin: true,
                pathRewrite: { "^/erd": "/erd" },
                secure: false
            },
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
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ],
    mode: "development"
});
