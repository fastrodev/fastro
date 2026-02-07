import { hydrateRoot } from "react-dom/client";
import { App } from "../modules/fail_client/App.tsx";
const el = document.getElementById("initial");
const props = el
  ? JSON.parse(el.textContent || "")
  : {};
if (el && el.parentNode) el.parentNode.removeChild(el);
hydrateRoot(document.getElementById("root")!, <App {...(props as Record<string, unknown>)} />);
