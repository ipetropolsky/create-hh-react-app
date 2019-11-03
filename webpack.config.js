const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const cssNano = require('cssnano');

const isProduction = process.env.NODE_ENV !== 'development';
const staticPath = path.resolve(__dirname, 'static');
const buildPath = path.resolve(__dirname, 'build');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
    entry: {
        index: path.join(staticPath, 'index.js'),
    },
    output: {
        path: buildPath,
        filename: '[name].[chunkhash:8].js',
    },
    resolve: {
        modules: [staticPath, nodeModulesPath],
        extensions: ['.js', '.jsx', '.less'],
        alias: {
            static: staticPath,
        },
    },
    mode: isProduction ? 'production' : 'development',
    // 'eval-source-map' не работает для CSS через MiniCssExtractPlugin
    devtool: 'source-map',
    watch: !isProduction,
    watchOptions: {
        ignored: ['node_modules'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [nodeModulesPath],
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.less$/,
                exclude: [nodeModulesPath],
                use: [
                    { loader: MiniCssExtractPlugin.loader, options: { sourceMap: true } },
                    { loader: 'css-loader', options: { sourceMap: true } },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [postcssPresetEnv(), ...(isProduction ? [cssNano()] : [])],
                            sourceMap: true,
                        },
                    },
                    { loader: 'less-loader', options: { sourceMap: true } },
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'img',
                        name: '[name].[hash:8].[ext]',
                    },
                },
            },
            {
                test: /\.svg$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'img',
                            name: '[name].[hash:8].[ext]',
                        },
                    },
                    {
                        loader: 'svgo-loader',
                        options: {
                            plugins: [
                                { removeTitle: true },
                                { convertColors: { shorthex: false } },
                                { convertPathData: false },
                            ],
                        },
                    },
                ],
            },
        ],
    },
    optimization: {
        minimize: isProduction,
        minimizer: [
            new TerserPlugin({
                cache: true,
                sourceMap: true,
                extractComments: false,
            }),
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'HH React App',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash:8].css',
            chunkFilename: '[id].[hash:8].css',
        }),
        ...(isProduction
            ? []
            : [
                  new BundleAnalyzerPlugin({
                      reportFilename: 'bundleAnalyzer.html',
                      analyzerMode: 'static',
                      openAnalyzer: false,
                      logLevel: 'warn',
                  }),
              ]),
    ],
    stats: {
        maxModules: 100,
        children: false,
    },
};
