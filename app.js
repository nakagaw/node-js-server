var http = require('http'),
      fs = require('fs');

var settings = require('./settings');
var server = http.createServer();
var template = fs.readFileSync(__dirname + '/www/index.html' , 'utf-8');

server.on('request' , function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(template);
    res.end();
});
server.listen(settings.port, settings.host, function() {
    console.log('Server running at http://' + settings.host + ':' + settings.port);
});