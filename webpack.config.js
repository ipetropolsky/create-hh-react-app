const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const cssNano = require('cssnano');

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = !isDevelopment;
const staticPath = path.resolve(__dirname, 'static');
const buildPath = path.resolve(__dirname, 'build');
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
const useHMR = isDevelopment;

module.exports = {
    context: staticPath,
    entry: {
        index: path.join(staticPath, 'index.jsx'),
        standalone: path.join(staticPath, 'standalone.jsx'),
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
                        options: { sourceMap: true, hmr: useHMR },
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
        }),
        new HtmlWebpackPlugin({
            title: 'Standalone page',
            chunks: ['vendors', 'standalone'],
            filename: 'standalone.html',
        }),
        new ExtractCssChunksPlugin({
            filename: isProduction ? '[name].[contenthash:8].css' : '[name].css',
            chunkFilename: isProduction ? '[id].[contenthash:8].css' : '[id].css',
        }),
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
        writeToDisk: true,
    },
};
