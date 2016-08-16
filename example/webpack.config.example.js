var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var lib = path.resolve(__dirname, 'lib');
var webpack = require('webpack');

module.exports = {
    entry: {
        app:[
            'webpack-dev-server/client?http://0.0.0.0:7000',
            './src/index'
        ]
    },
    output: {
        path:path.join(__dirname, '/lib'),
        filename: 'app.js',
        publicPath: '/lib/'
    },
    module: {
        loaders: [{
                test: /\.js$/,
                exclude: [/node_modules/, /lib/],
                loaders: [ 'babel-loader' ]
            },
            {
                test: /\.css$/,
                exclude: path.join(__dirname, 'src'),
                loader: 'style!css'
            }
        ]
    },
    resolve: {
        alias: {
          'react-picker': path.join(__dirname, '..', 'index.js')
        }
    }
};
