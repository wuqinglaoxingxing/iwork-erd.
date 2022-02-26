const {
    VueLoaderPlugin
} = require('vue-loader');
const {
    DefinePlugin
} = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const taskLoaderPlugin = require('./task/task-loader-plugin');

module.exports = {
    entry: ['./src/main.js'],
    output: {
        path: __dirname,
        filename: 'build/main.js',
        chunkFilename: 'build/bundle.[name].[chunkhash].js'
    },
    resolve: {
        alias: {
            '@': require('path').resolve(__dirname, 'src')
        }
    },
    module: {
        rules: [{
            test: /\.(vue|vx)$/,
            use: ['vue-loader']
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }, {
            test: /\.svg$/,
            use: ['svg-url-loader']
        }]
    },
    plugins: [
        new taskLoaderPlugin(),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            title: "iwork-erd"
        }),
        new DefinePlugin({
            BASE_URL:"'/'",
        })
    ]
};
