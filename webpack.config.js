const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const cssNano = require('cssnano');

const isProduction = process.env.NODE_ENV !== 'development';
const staticPath = path.resolve(__dirname, 'static');
const buildPath = path.resolve(__dirname, 'build');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const useHMR = true;

module.exports = {
    entry: {
        index: path.join(staticPath, 'index.jsx'),
        foo: path.join(staticPath, 'foo.jsx'),
    },
    output: {
        path: buildPath,
        filename: isProduction ? '[name].[chunkhash:8].js' : '[name].[hash:8].js',
    },
    resolve: {
        modules: [staticPath, nodeModulesPath],
        extensions: ['.js', '.jsx', '.less'],
        alias: {
            static: staticPath,
            'react-dom': !isProduction && useHMR ? '@hot-loader/react-dom' : 'react-dom',
        },
        symlinks: false,
    },
    mode: isProduction ? 'production' : 'development',
    // 'eval-source-map' не работает для CSS через ExtractCssChunksPlugin
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
                    options: {
                        cacheDirectory: true,
                    },
                },
            },
            {
                test: /\.less$/,
                exclude: [nodeModulesPath],
                use: [
                    {
                        loader: ExtractCssChunksPlugin.loader,
                        options: { sourceMap: true, hmr: !isProduction && useHMR },
                    },
                    { loader: 'css-loader', options: { sourceMap: true, importLoaders: 2 } },
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
                        name: '[name].[contenthash:8].[ext]',
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
                            name: '[name].[contenthash:8].[ext]',
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
            {
                test: /\.html$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                        },
                    },
                    'extract-loader',
                    {
                        loader: 'html-loader',
                        options: {
                            attrs: [':src', 'link:href'],
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
            chunks: ['index'],
        }),
        new HtmlWebpackPlugin({
            title: 'HH React Foo',
            chunks: ['foo'],
            filename: 'foo.html',
        }),
        new ExtractCssChunksPlugin({
            filename: isProduction ? '[name].[contenthash:8].css' : '[name].css',
            chunkFilename: isProduction ? '[id].[contenthash:8].css' : '[id].css',
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
        entrypoints: false,
        chunks: false,
        errorDetails: true,
        modules: false,
        performance: false,
        env: true,
        colors: true,
    },
    devServer: {
        contentBase: buildPath,
        compress: true,
        port: 9000,
        open: false,
        overlay: true,
        hot: useHMR,
        hotOnly: useHMR,
        liveReload: !useHMR,
        // quiet: true,
    },
};
