var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var webpack = require('webpack');

module.exports = {
    devtool: 'eval-source-map',
    entry: {
        datepicker: './src/DatePicker',
        citypicker: './src/CityPicker'
    },
    output: {
        path: path.join(__dirname, '/lib'),
        libraryTarget: 'umd',
        filename: '[name].js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loaders: ['babel-loader']
        }, {
            test: /\.css$/,
            exclude: path.join(__dirname, 'src'),
            loader: 'style!css'
        }]
    },
    devServer: {
        contentBase: path.join(__dirname, 'example')
    }
};
