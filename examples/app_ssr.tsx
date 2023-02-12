import fastro, { render } from "../server/mod.ts";
import App from "./pages/app.tsx";
import Hello from "./pages/hello.tsx";

// define an app component to render
// with bundle name 'app'
// attach this to page declaration
const app = render(<App />)
  .setBundleName("app")
  .dir("./examples/pages");

// define a hello component to render
// with bundle name 'hello'
// attach this to page declaration
const hello = render(<Hello />)
  .setBundleName("hello")
  .dir("./examples/pages");

const f = fastro()
  // set static endpoint url
  // default folder is at ./public
  // this is a place where hydrated files generated
  .static("/static")
  // set endpoint for app page
  .page("/", app, (req, res) => {
    // you can access the http request object
    console.log(req.url);
    return res.ssr(app).render();
  })
  // set endpoint for hello page
  .page("/hello", hello, (req, res) => {
    return res.ssr(hello)
      // and set the html title and other meta data
      // for seo purpose
      .title("hello")
      .meta(`name="viewport" content="width=device-width"`)
      .render();
  });

await f.serve();
