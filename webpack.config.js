const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    entry: { 
        main: './src/app/main.js' 
    },
    output: {
        path: path.resolve(__dirname, 'src', 'public'),
        filename: '[name].bundle.js',
        clean: true,
        assetModuleFilename: 'assets/[name][ext]'
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
                exclude: /index.html|node_modules/,
                use: 'html-loader'
            },
            {
                test: /\.css$/i,
                use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[hash][ext][query]'
                }
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/fonts/[hash][ext][query]'
                }
            },
            {
                test: /\.(fbx|obj|gltf|glb)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/models/[hash][ext][query]'
                }
            },
            {
                test: /\.(mp3)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/audios/[hash][ext][query]'
                }
            }
        ]
    },
    target: ['web', 'es5'],
    resolve: {
        roots: [
            path.resolve(__dirname, 'node_modules')
        ],
        alias: {
            '@styles': path.resolve(__dirname, 'src/app/styles'),
            '@views': path.resolve(__dirname, 'src/app/views'),
            '@controllers': path.resolve(__dirname, 'src/app/controllers'),
            '@core': path.resolve(__dirname, 'src/app/core'),
            '@board': path.resolve(__dirname, 'src/app/game/board'),
            '@characters': path.resolve(__dirname, 'src/app/game/characters'),
            '@items': path.resolve(__dirname, 'src/app/game/items'),
            '@maps': path.resolve(__dirname, 'src/app/game/maps'),
            '@routes': path.resolve(__dirname, 'src/app/routes'),
            '@models': path.resolve(__dirname, 'src/app/assets/models'),
            '@audios': path.resolve(__dirname, 'src/app/assets/audios'),
            '@images': path.resolve(__dirname, 'src/app/assets/images')
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'HexChess',
            filename: 'index.html',
            template: 'src/app/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'main.bundle.css'
        })
    ]
};