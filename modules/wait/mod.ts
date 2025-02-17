import { Fastro } from "@app/mod.ts";
import pageLayout from "@app/modules/wait/wait.layout.tsx";
import pageComponent from "@app/modules/wait/wait.page.tsx";
import pageHandler, { submitHandler } from "@app/modules/wait/wait.handler.ts";

export default function (s: Fastro) {
  // add page
  s.page("/", {
    folder: "modules/wait",
    component: pageComponent,
    layout: pageLayout,
    handler: pageHandler,
  });

  s.post("/api/submit", submitHandler);
  return s;
}
