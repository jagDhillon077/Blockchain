
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log('got a request!');
    response.write('do it again?');
    response.end();
});

server.listen(3000);


class Block{
    constructor(index, timestamp, data, previousHash = "") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = ""
    }
}