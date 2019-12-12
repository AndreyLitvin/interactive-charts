const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    resolve: {
      extensions: ['.js', '.jsx']
    },
    mode: "production",
    entry: "./src/index.jsx",
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: "index.js",
        publicPath: "/"
    },
    devServer: {
        contentBase: path.join(__dirname, 'lib'),
        compress: true,
        port: 9001
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: /node_modules/,
            },
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: "javascript/auto"
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.png$/i,
                use: {
                    loader: 'file-loader'
                }
            }
        ]
    }
};