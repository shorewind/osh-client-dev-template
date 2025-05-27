const path = require("path");
const nodePolyfillWebpackPlugin = require('node-polyfill-webpack-plugin')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {DefinePlugin} = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PROCESS_BASE_PATH = process.cwd();

// Cesium deps
const cesiumSource = 'node_modules/cesium/Build/Cesium';
const cesiumBaseUrl = "cesiumStatic";

module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "build"),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "./", "index.html"),
            favicon: path.join(__dirname, "images", "opensensorhub.png")
        }),
        new DefinePlugin({
            BASE_URL: JSON.stringify('/'),
            // Define relative base path in cesium for loading assets
            // CESIUM_BASE_URL: JSON.stringify('cesium')
            CESIUM_BASE_URL: JSON.stringify(cesiumBaseUrl)
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname,'images'), to: 'images', noErrorOnMissing: true},
                { from: path.join(PROCESS_BASE_PATH+'/'+cesiumSource, 'ThirdParty'), to: `${cesiumBaseUrl}/ThirdParty`, force:true },
                { from: path.join(PROCESS_BASE_PATH+'/'+cesiumSource, 'Workers'), to: `${cesiumBaseUrl}/Workers`, force:true },
                { from: path.join(PROCESS_BASE_PATH+'/'+cesiumSource, 'Assets'), to: `${cesiumBaseUrl}/Assets`, force:true },
                { from: path.join(PROCESS_BASE_PATH+'/'+cesiumSource, 'Widgets'), to: `${cesiumBaseUrl}/Widgets`, force:true }
            ],
        }),
        new nodePolyfillWebpackPlugin(),
    ],
    devServer: {
        client: {
            overlay: false
        },
        static: {
            directory: path.join(__dirname, "build"),
        },
        port: 3000,
        // proxy: [
        //     {
        //         context: ['/api'],
        //         target: 'http://192.168.1.136:8181/sensorhub',
        //         changeOrigin: true,
        //         pathRewrite: { '^/api': '' }
        //     }
        // ]
        // proxy: [
        //     {
        //         context: ['/sos'],
        //         target: 'http://192.168.1.136:8181/sensorhub',
        //         changeOrigin: true
        //     }
        // ]
    },
    module: {
        // exclude node_modules
        rules: [
            {
                test: /\.(js|jsx|tsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader',]
            },
            {
                test: /\.(glb|gltf)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                    }
                }
            },
            {
                test: /\.(mp4)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                    }
                },
            },
            {
                test: /\.worker\.js$/,
                use: {loader: 'worker-loader', options: {filename: 'Worker.[chunkhash].js'}}
            },
        ],
    },
    // pass all js files through Babel
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules'),
        ],
        extensions: [".*", ".js", ".jsx", ".tsx"],    // <-- added `.jsx` here
        fallback: {
            "url": require.resolve("url/"),
            "zlib": require.resolve("browserify-zlib"),
            "https": require.resolve("https-browserify"),
            "http": require.resolve("stream-http"),
            "buffer": require.resolve("buffer/"),
            "assert": require.resolve("assert/"),
            "util": require.resolve("util/"),
            "stream": require.resolve("stream-browserify"),
            fs: false
        }
    }
};