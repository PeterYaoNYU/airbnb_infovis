const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
    mode: 'development',
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "index.html")
        }),
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'data'), to: path.resolve(__dirname, 'dist', 'data') }
            ],
        }),
    ],
    module: {
        rules:[ {
            test: /\.?js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|jp(e*)g|svg|gif)$/,
                use: ["file-loader"],
            },
            {
                test: /\.svg$/,
                use:['@svgr/webpack'],
            },
            {
                test:/\.js$/,
                enforce: 'pre',
                use: ["source-map-loader"]
            },
        ],
    },
    devServer:{
        port: 9001,
        static: {
            directory: path.join(__dirname, 'dist'),
        },
    },
    devtool: "source-map"
}