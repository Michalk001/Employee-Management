var path = require('path');

const webpack = require("webpack");
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: ["./src/index.js"],
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    target: 'node',
    mode: 'production',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'app.js'
    },
};