import { assert } from "https://deno.land/std@0.203.0/assert/assert.ts";
import { decryptData } from "./decrypt.ts";
import { encryptData } from "./encrypt.ts";
import { exportCryptoKey, importCryptoKey, keyPromise } from "./key.ts";

Deno.test(
  {
    permissions: { net: true, env: true, read: true, write: true },
    sanitizeResources: false,
    sanitizeOps: false,
    name: "Decrypt",
    async fn() {
      const keyType = "AES-GCM";
      const keyUsages: KeyUsage[] = ["encrypt", "decrypt"];
      const key = await keyPromise;
      const exportedKeyString = await exportCryptoKey(key);

      const importedKey = await importCryptoKey(
        exportedKeyString,
        keyType,
        keyUsages,
      );
      const plaintext = "Hello, encryption!";

      const encryptedData = await encryptData(importedKey, plaintext);
      const decryptedText = await decryptData(importedKey, encryptedData);

      console.log("Decrypted Text:", decryptedText);
      assert(decryptedText, "get");
    },
  },
);
