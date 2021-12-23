const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TSLintPlugin = require('tslint-webpack-plugin');

const PATHS = {
    source: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build')
};

module.exports = (env) => {

    const common = {
        entry: path.join(PATHS.source, 'app.ts'),
        output: {
            filename: '[name].js',
            path: PATHS.build
        },
        performance: {
            hints: false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"]
        },
       plugins: [
            new webpack.ProvidePlugin({
                PIXI: 'pixi.js-legacy'
            }),
            new CopyWebpackPlugin([
                {from: 'resources', to: 'resources'}
            ]),
            new HtmlWebpackPlugin({
                inject: false,
                template: "./index.html"
            }),
            new TSLintPlugin({
                files: ['./src/**/*.ts']
            })
        ]
    };

    return common;
};