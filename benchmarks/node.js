const http = require("http");

const server = http.createServer((_req, res) => {
  res.end("Hello World");
});

server.listen(8000);
