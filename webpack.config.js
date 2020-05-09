const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const cssNano = require('cssnano');

const { isDevelopment, isProduction, publicPath, useHMR } = require('./config');

const staticPath = path.resolve(__dirname, 'static');
const rootPath = path.join(staticPath, 'public');
const buildPath = path.resolve(__dirname, 'build');
const buildStaticDir = 'static';
const buildImageDir = path.join(buildStaticDir, 'img');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const bundleAnalyzer = {
    enabled: !!process.env.ANALYZE_BUNDLE,
    options: {
        reportFilename: path.resolve(__dirname, 'bundleAnalyzer.html'),
        analyzerMode: 'static',
        openAnalyzer: true,
        logLevel: 'info',
        defaultSizes: 'parsed',
    },
};

module.exports = {
    entry: {
        index: path.join(staticPath, 'index.jsx'),
        standalone: path.join(staticPath, 'standalone.jsx'),
    },
    output: {
        path: buildPath,
        filename: path.join(buildStaticDir, isProduction ? '[name].[chunkhash:8].js' : '[name].[hash:8].js'),
        publicPath,
    },
    resolve: {
        modules: [staticPath, nodeModulesPath],
        extensions: ['.js', '.jsx', '.less'],
        alias: {
            static: staticPath,
            config: path.resolve(__dirname, 'config'),
            'react-dom': useHMR ? '@hot-loader/react-dom' : 'react-dom',
        },
        symlinks: false,
    },
    mode: isProduction ? 'production' : 'development',
    // 'eval-source-map' не работает для CSS через ExtractCssChunksPlugin
    devtool: 'source-map',
    watch: isDevelopment,
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
                        options: { publicPath, sourceMap: true, hmr: useHMR },
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
                        outputPath: buildImageDir,
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
                            outputPath: buildImageDir,
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
        splitChunks: {
            name: true,
            chunks: 'initial',
            cacheGroups: {
                vendors: {
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                },
            },
        },
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [`${buildPath}/*`, bundleAnalyzer.options.reportFilename],
        }),
        new HtmlWebpackPlugin({
            title: 'Main page',
            chunks: ['vendors', 'index'],
            filename: path.join(buildPath, 'index.html'),
        }),
        new HtmlWebpackPlugin({
            title: 'Standalone page',
            chunks: ['vendors', 'standalone'],
            filename: path.join(buildPath, 'standalone.html'),
        }),
        new ExtractCssChunksPlugin({
            filename: path.join(buildStaticDir, isProduction ? '[name].[contenthash:8].css' : '[name].css'),
            chunkFilename: path.join(buildStaticDir, isProduction ? '[id].[contenthash:8].css' : '[id].css'),
        }),
        new CopyPlugin([{ from: `${rootPath}/**/*`, to: buildPath, context: rootPath }]),
        ...(bundleAnalyzer.enabled ? [new BundleAnalyzerPlugin(bundleAnalyzer.options)] : []),
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
        port: 9001,
        open: false,
        overlay: true,
        hot: useHMR,
        hotOnly: useHMR,
        liveReload: !useHMR,
    },
};
