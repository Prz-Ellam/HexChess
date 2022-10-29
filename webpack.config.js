const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    entry: { 
        main: './src/app/main.js' 
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true,
        assetModuleFilename: '[name][ext]'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ '@babel/preset-env' ]
                    }
                }
            },
            {
                test: /\.html$/i,
                use: 'html-loader'
            },
            {
                test: /\.css$/i,
                use: [ 
                    { 
                        loader: 'style-loader',
                        options: {
                            injectType: 'singletonStyleTag'
                        }
                    }, 
                    'css-loader' ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|tff|eot|woff|woff2|fbx)$/i,
                type: 'asset/resource'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'HexChess',
            filename: 'index.html',
            template: 'src/app/index.html'
        })
    ]
};