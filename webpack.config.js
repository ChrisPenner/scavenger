var webpack = require("webpack");
var path = require("path");
module.exports = {
    entry: "./main",
    output: {
        path: path.resolve(__dirname, "dist", "js"),
        filename: "bundle.js",
        sourceMapFilename: "bundle.map.js",
    },
    devtool: 'source-map',
    devServer: {
        port: 3000,
        inline: true,
        historyApiFallback: {
            index: 'index.html'
        },
        contentBase: './dist',
        hot: true,
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/, 
                loaders: [
                    'react-hot',
                    'babel-loader',
                ],
                exclude: path.resolve(__dirname, "node_modules"),
            },
        ]
    },
    resolve: {
        extensions: ["", ".js", ".jsx"],
        root: [
            path.resolve('./client')
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            'React': 'react',
        }),
    ]
};
