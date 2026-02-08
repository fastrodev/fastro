import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 100,
  duration: "10s",
};

const ENDPOINT = __ENV.ENDPOINT || "/";
const METHOD = __ENV.METHOD || "GET";

export default function () {
  const url = `http://localhost:3000${ENDPOINT}`;
  let res;

  if (METHOD === "POST") {
    const payload = JSON.stringify({
      name: "fastro",
      email: "hello@fastro.dev",
    });
    const params = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    res = http.post(url, payload, params);
  } else {
    res = http.get(url);
  }

  check(res, {
    "status is 200": (r) => r.status === 200,
  });
}
