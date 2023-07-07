// deno-lint-ignore-file
    // DO NOT EDIT. This file is generated automatically. 
    // Required for the development and deployment process.
    declare global { interface Window { __INITIAL_DATA__: any; } } 
    import { decode } from "https://deno.land/std@0.192.0/encoding/base64.ts"; 
    import { hydrateRoot } from "https://esm.sh/react-dom@18.2.0/client"; 
    import React from "https://esm.sh/react@18.2.0"; 
    import App from "../pages/App.tsx";
    const props = JSON.parse(new TextDecoder("utf-8").decode(decode(window.__INITIAL_DATA__))) || {}; 
    hydrateRoot(document.getElementById("root") as HTMLElement, <App {...props} />);
    