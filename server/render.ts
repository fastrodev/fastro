import ReactDOMServer from "https://esm.sh/react-dom/server"

async function createHTML(element: JSX.Element, client?: string) {
    const component = ReactDOMServer.renderToString(element)
    let js = `(() => {})();`

    if (client) {
        const { files } = await Deno.emit(client, {
            bundle: "module",
            compilerOptions: { lib: ["dom", "dom.iterable", "esnext"] }
        })
        js = files["deno:///bundle.js"]
    }

    const html = `<html>
    <head>
    </head>
    <body>
    <div id="root">${component}</div>
    <script>${js}</script>
    <body>
    </html>`

    return html
}

let html: string

export async function ssr(element: JSX.Element, client?: string) {
    if (!html) html = await createHTML(element, client)
    return new Response(html, {
        headers: {
            "content-type": "text/html",
        }
    })
}

export function render(element: JSX.Element) {
    const component = ReactDOMServer.renderToString(element)
    return new Response(component, {
        headers: {
            "content-type": "text/html",
        }
    })
}