const http = require("http");

const hostname = "127.0.0.1";
const port = 3006;

const server = http.createServer((req, res) => {
  res.end("Hello!");
});

server.listen(port, hostname, () => {
  console.log("node listening on:", port);
});
