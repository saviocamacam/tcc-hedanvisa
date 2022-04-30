const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const LodashReplacementPlugin = require('lodash-webpack-plugin')

const PATHS = {
    src: path.join(__dirname, 'src')
}

module.exports = {
    plugins: [
        new PurgecssPlugin({
            fontFace: true,
            keyframes: true,
            paths: glob.sync(`${PATHS.src}/**`, { nodir: true }),
            whitelistPatterns: [
                /^cdk-/,
                /^mat-/,
                /^ps/,
            ]
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        }),
        new LodashReplacementPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
}
