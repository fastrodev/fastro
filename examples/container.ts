import application from "../server/mod.ts";

const app = application();

type MyData = {
  key: string;
  value: string;
  status: boolean;
};

// set data from container
app.set("key1", "value1")
  // set data with custom type
  .set<MyData>("myData", { key: "myData", value: "ok", status: true })
  // set data with expired time
  .set("expired", "the expired data", { isExpired: true, expirySeconds: 5 })
  .get("/", (req, res) => {
    // you can also set data from handler
    req.set("new", "data from handler");
    return res.json({
      // access data from handler
      val: req.get("key1"),
      expired: req.get("expired"),
    });
  })
  .get("/my-data", (req, res) => {
    return res.json({
      new: req.get("new"),
      // get data with custom type
      myData: req.get<MyData>("myData"),
      expired: req.get("expired"),
    });
  });

await app.serve();
