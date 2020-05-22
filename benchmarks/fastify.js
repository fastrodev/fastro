const fastify = require("fastify")();

const port = 3002;
fastify.get("/", async (request, reply) => {
  return "Hello";
});

const start = async () => {
  await fastify.listen(port);
  console.log("fastify listening on", port);
};
start();
