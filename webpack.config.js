module.exports = {
    entry: "./client/js/index.js",
    output: {
        path: __dirname + "/public/js",
        filename: "app.js"
    },
    module: {
        loaders: [
            {
              test: /\.js$/,
              exclude: /(node_modules|bower_components|.vagrant|cookbooks|public|test)/,
              loader: 'babel', // 'babel-loader' is also a valid name to reference
              query: {
                presets: ['es2015']
              }
            }
        ]
    }
};
