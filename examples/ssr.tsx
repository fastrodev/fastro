import fastro, { render } from "../server/mod.ts";
import App from "./pages/app.tsx";
import Hello from "./pages/hello.tsx";

// define a hello component to render
// attach this to page declaration
const hello = render(<Hello />)
  // used for SSR hydration process
  .dir("./examples/pages")
  // with bundle js file name 'hello'
  .setBundleName("hello");

const app = render(<App />)
  .setBundleName("app")
  .dir("./examples/pages");

const f = fastro()
  // set static endpoint url
  // default folder is at ./public
  // this is a place where hydrated files generated
  .static("/static")
  // set endpoint for app page
  .page("/", hello, (req, res) => {
    // you can access the http request object
    console.log(req.url);
    return res.ssr(hello).render();
  })
  // set endpoint for hello page
  .page("/app", app, (req, res) => {
    return res.ssr(app)
      // and set the html title and other meta data
      // for seo purpose
      .title("click app")
      .meta(`name="viewport" content="width=device-width"`)
      .render();
  });

await f.serve();
