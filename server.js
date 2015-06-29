/*
 * server.js
 */
exports.server = function() {

    var http = require('http')
        , fs = require('fs')
        , path = require('path')
        , mime = require('mime')
        ;

    //server settings
    var server = http.createServer()
        , port = 1337
        , host = '127.0.0.1'
        , cache = {} //ファイルの内容を格納するやつ
        ;

    //404
    function send404(res) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('404 not found...');
    }

    //200
    function sendFile(res, filePath, fileContent) {
        // console.log('4');
        res.writeHead(200, {'Content-Type': mime.lookup(path.basename(filePath))});
        //mime.lookup & path.basename is;
        //filePath の末尾のファイル名を読み込んでmime typeを判断してる
        res.end(fileContent);
    }

    // cache してたらそれを、なかったらディスクから供給する関数
    function serverStatic(res, cache, absPath) {
        // console.log('3');
        if (cache[absPath]) {
            sendFile(res, absPath, cache[absPath]);
            console.log('メモリからファイル供給してまっせ');
        } else {
            fs.exists(absPath, function(exists) { //ファイルはあるか
                if (exists) {
                    fs.readFile(absPath, function(err, data) { //ディスクからファイルを読む
                        if (err) {
                            send404(res);
                        } else {
                            cache[absPath] = data;
                            sendFile(res, absPath, data);
                            console.log('ディスクからファイル供給してまっせ');
                        }
                    });
                } else {
                    send404(res);
                }
            });
        }
    }

    //server request
    server.on('request' , function (req, res) {
        var filePath = false;
        if (req.url == '/') {
            filePath = 'public/index.html';
        } else {
            filePath = 'public' + req.url;
        }
        var absPath = './' + filePath; //server.jsからの相対Pathに
        console.log('absPath => ' + absPath);
        serverStatic(res, cache, absPath); //応答として静的ファイル供給
    });

    //server wake up
    server.listen(port, host, function() {
        // console.log('1');
        console.log('Server running at http://' + host + ':' + port);
    });

};
