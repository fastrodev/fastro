import { Fastro } from "@app/mod.ts";
import pageLayout from "@app/modules/home/home.layout.tsx";
import pageComponent from "@app/modules/home/home.page.tsx";
import pageHandler, {
  deletePostHandler,
  postHandler,
} from "@app/modules/home/home.handler.ts";

export default function (s: Fastro) {
  // add page
  s.page("/home", {
    folder: "modules/home",
    component: pageComponent,
    layout: pageLayout,
    handler: pageHandler,
  });

  // Add API endpoint for post creation
  s.post("/api/post", postHandler);

  // Add API endpoint for deleting a post
  s.delete("/api/post/:id", deletePostHandler);

  return s;
}
