// deno-lint-ignore-file
import {
    computed,
    Signal,
    signal,
    useSignal,
} from "https://esm.sh/@preact/signals@1.3.0";
import { createContext } from "preact";

export function createAppState() {
    const room = signal({
        name: "global",
        id: "01JAC4GM721KGRWZHG53SMXZP0",
    });

    return { room };
}

export const AppContext = createContext(createAppState());
