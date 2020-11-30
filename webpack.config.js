const HtmlWebPackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { jsonBeautify } = require('beautify-json');

const config = {
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/dgs/',
        filename: 'bundle.js',
    },
    resolve: {
        modules: [path.join(__dirname, 'src'), 'node_modules'],
        alias: {
            react: path.join(__dirname, 'node_modules', 'react'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                ],
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'less-loader',
                    },
                ],
            },
            {
              test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
              exclude: /node_modules/,
              use: ['file-loader?name=[name].[ext]']
            }
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './public/index.html',
            favicon: './public/favicon.png',
        }),
    ],
};

module.exports = (env, argv) => {
    config.mode = argv.mode;
    if (argv.mode === 'development') {
        config.entry = ['react-hot-loader/patch', './src'];
        config.devtool = 'inline-source-map';
        config.resolve.alias['react-dom'] = '@hot-loader/react-dom';
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
        config.devServer = {
            compress: true,
            hot: true,
            contentBase: './build',
            historyApiFallback: true, // For react router
            disableHostCheck: true
        };
    }

    if (argv.mode === 'production') {
        config.entry = ['./src'];
        config.devtool = false;
        config.output.filename = '[name].[chunkhash].js';
        config.output.chunkFilename = '[name].[chunkhash].js';
        config.optimization = {
            moduleIds: 'hashed',
            runtimeChunk: {
                name: 'manifest',
            },
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        test: /node_modules\/(?!antd\/).*/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                    // This can be your own design library.
                    antd: {
                        test: /node_modules\/(antd\/).*/,
                        name: 'antd',
                        chunks: 'all',
                    },
                },
            },
        };
        config.plugins.push(
            new CompressionPlugin({
                test: /\.js(\?.*)?$/i,
            }),
            new CopyPlugin({
                patterns: [
                    { from: './public/_redirects' },
                    { from: './public/robots.txt'},
                    { from: './public/manifest.json'},
                ],
            })
        );
        config.performance = {
            hints: 'warning',
            // Calculates sizes of gziped bundles.
            assetFilter(assetFilename) {
                return assetFilename.endsWith('.js.gz');
            },
        };
    }

    console.log('Webpack config\n');

    jsonBeautify(config);

    return config;
};
