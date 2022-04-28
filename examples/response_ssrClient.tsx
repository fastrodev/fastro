import React from "https://esm.sh/react"
import ReactDOM from "https://esm.sh/react-dom"
import App from "./response_ssrApp.tsx"

ReactDOM.hydrate(
    <App />,
    //@ts-ignore: used by Deno.emit
    document.getElementById("root")
)