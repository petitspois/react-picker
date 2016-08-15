var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.example');
var port = 8080;
var options = {
    publicPath: config.output.publicPath
};



var server = new WebpackDevServer(webpack(config), options);
server.listen(port, '0.0.0.0', function (err, result) {
  if (err) console.error(err);
  console.log('Listening at localhost:%s', port);
});
