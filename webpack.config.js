var webpack = require("webpack");
var path = require("path");
module.exports = {
    entry: "./main",
    output: {
        path: path.resolve(__dirname, "dist", "js"),
        publicPath: "/js/",
        filename: "bundle.js",
        sourceMapFilename: "bundle.map.js",
    },
    devtool: 'source-map',
    devServer: {
        contentBase: './dist',
        historyApiFallback: {
            index: 'index.html'
        },
        proxy: {
            "/api/*": {
                target: 'http://localhost:8080',
            }
        }
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
