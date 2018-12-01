const path = require('path');

module.exports = {
    watch: true,
    
    mode: "development",

    entry: "./index.jsx",

    output: {
        path: path.resolve("./../server/public/js"),
        filename: "bundle.js"
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }

}