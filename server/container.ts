import { Dependency } from "./types.ts"

export function dependency(): Dependency {
  const deps = new Map<string, unknown>()
  const instance = {
    deps,
    set: (key: string, val: unknown) => {
      deps.set(key, val)
      return instance
    },
    get: (key: string) => {
      return deps.get(key)
    },
  }
  return instance
}
