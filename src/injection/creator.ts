import { Fastro } from "../../mod.ts";
import { loader } from "./loader.ts";
import { methodContainer, controllerContainer } from "./container.ts";

interface Controller {
  instance: any;
  options: any;
  methodList: any[];
  hookList: any[];
  hookOptions: any;
}

const createRoutes = () => {
  return (fastro: Fastro, done: Function) => {
    fastro.get('/', req => req.send('ok'))
    done()
  }
  // const { instance, methodList } = controller
  // return (fastro: Fastro, next: Function): void => {
  //   methodList.map(controllerMethod => {
  //     const { functionName, options } = controllerMethod
  //     const handler: any = async (...args: any) => instance[functionName](...args)
  //     const routeOptions = { ...options, handler }
  //     fastro.route(routeOptions)
  //   })
  //   methodList.length = 0
  //   next()
  // }
}

function createControllers() {
  return (fastro: Fastro, done: Function) => {
    fastro.use((req) => {
      return req.send('use')
    })
    fastro.get('/ok', req => req.send('ok'))
    done()
  }
}

export async function createServer() {
  // await loader()
  const server = new Fastro()
  server.use(req => {
    return req.send('ok')
  })

  server.get('/', req => req.send('root'))


  
  // const controller = createControllers()
  // server.register(controller)
  return server
}
