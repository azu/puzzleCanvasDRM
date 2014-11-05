var webpack = require("webpack");
module.exports = {
    context: __dirname + "/lib",
    entry: {
        encodePuzzle: "./encodePuzzle.js",
        decodePuzzle: "./decodePuzzle.js"
    },
    output: {
        filename: "dist/[name].bundle.js",
        library: "[name]",
        libraryTarget: "umd"
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]
};