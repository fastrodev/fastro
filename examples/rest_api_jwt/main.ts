import { Fastro } from "../../mod.ts";
import { createJwt, jwtMiddleware } from "./middleware.ts";
import {
  getFruitHandler,
  updateFruitHandler,
  createFruitHandler,
  deleteFruitHandler,
} from "./handlers.ts";

const server = new Fastro();

// setup JWT auth
server
  .use(jwtMiddleware)
  .post("/token", (req) => {
    const jwt = createJwt();
    req.send({ token: jwt });
  });

// setup API endpoint
server
  .get("/", getFruitHandler)
  .post("/", createFruitHandler)
  .put("/", updateFruitHandler)
  .delete("/", deleteFruitHandler);

await server.listen({ port: 8000 }, (err, addr) => {
  if (err) console.error(err);
  console.log("Listen on:", addr);
});
