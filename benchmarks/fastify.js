const fastify = require("fastify")();

// Declare a route
fastify.get("/", async (request, reply) => {
  return "Hello";
});

// Run the server!
const start = async () => {
  await fastify.listen(3002);
  console.log(`fastify listening on: ${fastify.server.address().port}`);
};
start();
