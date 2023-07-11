import { hydrateRoot } from "https://esm.sh/react-dom@18.2.0/client?dev";
import { createElement } from "https://esm.sh/react@18.2.0?dev";
import app from "../pages/app.tsx";
const el = createElement(app);
hydrateRoot(document.getElementById("root") as Element, el);
