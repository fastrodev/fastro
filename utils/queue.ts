export function createTaskQueue() {
    // deno-lint-ignore no-explicit-any
    const array: any = [];

    let isExecuting = false;
    async function exec() {
        while (array.length > 0) {
            const { fn, args, resolve } = array.shift();
            try {
                const result = await fn(...args);
                resolve(result);
            } catch (error) {
                console.error("Error executing function:", error);
            }
        }
        isExecuting = false;
    }

    // deno-lint-ignore no-explicit-any
    function process<T extends any[], R>(
        fn: (...args: T) => Promise<R> | R,
        ...args: T
    ): Promise<R> {
        return new Promise((resolve) => {
            array.push({ fn, args, resolve });
            if (!isExecuting) {
                isExecuting = true;
                exec();
            }
        });
    }

    return { process: process };
}
