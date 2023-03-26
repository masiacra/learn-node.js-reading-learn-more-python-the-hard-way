const http = require("http");

http.createServer(function(rer, res) {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write("Hello from node!");
	res.end();
}).listen(3000);
