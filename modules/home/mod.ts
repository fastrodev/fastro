import { Fastro } from "@app/mod.ts";
import pageLayout from "@app/modules/home/home.layout.tsx";
import pageComponent from "@app/modules/home/home.page.tsx";
import pageHandler, {
  commentHandler,
  deletePostHandler,
  getCommentsHandler,
  postHandler,
} from "@app/modules/home/home.handler.ts";
import postDetailComponent from "@app/modules/home/post.page.tsx";
import postDetailHandler from "@app/modules/home/post.handler.ts";

export default function (s: Fastro) {
  console.log("Registering routes in home module");

  // add page
  s.page("/home", {
    folder: "modules/home",
    component: pageComponent,
    layout: pageLayout,
    handler: pageHandler,
  });

  // Add post detail page
  s.page("/post/:id", {
    folder: "modules/home",
    component: postDetailComponent,
    layout: pageLayout,
    handler: postDetailHandler,
  });

  // Add API endpoint for post creation
  s.post("/api/post", postHandler);

  // Add API endpoint for deleting a post
  s.delete("/api/post/:id", deletePostHandler);

  s.post("/api/comment", commentHandler);
  s.get("/api/comments/:id", getCommentsHandler);

  return s;
}
