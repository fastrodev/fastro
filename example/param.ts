import { fastro, getParams, getParam } from '../server/mod.ts'

const app = fastro()

app.get('/:id/user/:name', (req: Request) => {
    const params = getParams(req)
    const param = getParam('id', req)
    return new Response(JSON.stringify({
        params,
        param
    }))
})

await app.serve()