var webpack = require("webpack");
var path = require("path");
module.exports = {
    entry: "./main",
    output: {
        path: __dirname,
        filename: "bundle.js",
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/, 
                loader: "babel-loader",
                exclude: path.resolve(__dirname, "node_modules")
            },
        ]
    },
    resolve: {
        extensions: ["", ".js", ".jsx"]
    }
};
