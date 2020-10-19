import { FASTRO_VERSION } from "../core/types.ts";

const message = `fastro-cli ${FASTRO_VERSION}

USAGE
    fastro [COMMANDS] [OPTIONS]

COMMANDS:
    init            Generate default controller, middleware, static, and template files
    serve           Run server
    register        Register an account
    deploy          Deploy webapp to google cloud run
    
OPTIONS:
    --help          Prints help information
    --version       Prints version information
`;

export function handleHelp() {
  console.info(message);
}
