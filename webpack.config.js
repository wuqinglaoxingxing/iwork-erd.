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
        extensions: ['.js', '.vue', '.json'],
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
        },{
            test: /\.(css|scss)$/,
            use: ['vue-style-loader?sourceMap', 'css-loader?sourceMap', 'postcss-loader?sourceMap', 'sass-loader?sourceMap']
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                publicPath: "../",
                name: "build/[path][name].[ext]",
                context: "src/asset",
                limit: 5000
            }
        }, {
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
        }],
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
