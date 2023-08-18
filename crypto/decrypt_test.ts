import { assert } from "https://deno.land/std@0.198.0/assert/assert.ts";
import { decryptData } from "./decrypt.ts";
import { encryptData } from "./encrypt.ts";
import { exportCryptoKey, importCryptoKey, keyPromise } from "./key.ts";

Deno.test(
  function Decrypt() {
    const keyType = "AES-GCM";
    const keyUsages: KeyUsage[] = ["encrypt", "decrypt"];
    keyPromise.then(async (key) => {
      const exportedKeyString = await exportCryptoKey(key);

      const importedKey = await importCryptoKey(
        exportedKeyString,
        keyType,
        keyUsages,
      );
      const plaintext = "Hello, encryption!";
      const encryptedData = await encryptData(importedKey, plaintext);
      decryptData(importedKey, encryptedData).then((decryptedText) => {
        assert(decryptedText, "get");
      });
    });
  },
);
