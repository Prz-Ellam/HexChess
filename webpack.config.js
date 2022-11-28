const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: { 
        main: './src/frontend/main.js' 
    },
    output: {
        path: path.resolve(__dirname, 'src', 'backend', 'public'),
        filename: '[name].bundle.js',
        clean: true,
        assetModuleFilename: 'assets/[name][ext]'
    },
    //devtool: 'source-map',
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
                    filename: 'assets/images/[name][ext]'
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
            },
            {
                test: /\.(ico)$/i,
                type: 'asset/resource',
                generator: {
                    filename: '[name][ext]'
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
            '@styles': path.resolve(__dirname, 'src/frontend/styles'),
            '@views': path.resolve(__dirname, 'src/frontend/views'),
            '@controllers': path.resolve(__dirname, 'src/frontend/controllers'),
            '@core': path.resolve(__dirname, 'src/frontend/core'),
            '@board': path.resolve(__dirname, 'src/frontend/game/board'),
            '@characters': path.resolve(__dirname, 'src/frontend/game/characters'),
            '@items': path.resolve(__dirname, 'src/frontend/game/items'),
            '@maps': path.resolve(__dirname, 'src/frontend/game/maps'),
            '@routes': path.resolve(__dirname, 'src/frontend/routes'),
            '@models': path.resolve(__dirname, 'src/frontend/assets/models'),
            '@audios': path.resolve(__dirname, 'src/frontend/assets/audios'),
            '@images': path.resolve(__dirname, 'src/frontend/assets/images'),
            '@assets': path.resolve(__dirname, 'src/frontend/assets')
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'HexChess',
            filename: 'index.html',
            template: 'src/frontend/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'main.bundle.css'
        }),
    ],
    optimization: {
        minimizer: [
          new CssMinimizerPlugin(),
          '...'
        ],
        minimize: true,
    }
};