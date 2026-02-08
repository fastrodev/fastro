/* c8 ignore file */
import type { Middleware } from "./types.ts";
import * as manifest from "../manifest.ts";

export const sortNames = (names: string[]) => {
  return names.sort((a, b) => {
    if (a === "index") return -1;
    if (b === "index") return 1;
    if (a === "profile") return 1;
    if (b === "profile") return -1;
    return a.localeCompare(b);
  });
};

export function autoRegisterModules(
  app: { use: (middleware: Middleware) => void },
) {
  const registerFromNamespace = (name: string, ns: Record<string, unknown>) => {
    const def = ns.default as unknown;
    if (typeof def === "function") {
      app.use(def as unknown as Middleware);
      console.info(`✅ Registered default export from ${name}/mod.ts`);
      return true;
    }

    const named = ns[name];
    if (typeof named === "function") {
      app.use(named as unknown as Middleware);
      console.info(`✅ Registered ${name} export from ${name}/mod.ts`);
      return true;
    }
    return false;
  };

  try {
    /**
     * KUNCI UTAMA:
     * Jangan gunakan variabel. Tulis jalurnya langsung sebagai string.
     * Ini memberi tahu bundler Deno Deploy: "Sertakan file ini!"
     */

    // Ambil semua key (nama modul) dari manifest
    const names = sortNames(Object.keys(manifest));

    for (const name of names) {
      //
      const ns = (manifest as Record<string, unknown>)[name];
      if (ns && typeof ns === "object") {
        registerFromNamespace(name, ns as Record<string, unknown>);
      }
    }
  } catch (err) {
    // Sekarang kita bisa melihat error yang bermakna jika gagal
    console.error(
      `❌ [Loader] Gagal membaca manifest di dalam loader:`,
      (err as Error).message,
    );
  }
}
