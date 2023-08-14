export const keyType = "AES-GCM";
export const keyUsages: KeyUsage[] = ["encrypt", "decrypt"];
const format = "jwk";

export const keyPromise = crypto.subtle.generateKey(
  { name: keyType, length: 256 },
  true,
  keyUsages,
);

export function exportCryptoKey(key: CryptoKey) {
  return crypto.subtle.exportKey(format, key).then((exportedKey) => {
    return JSON.stringify(exportedKey);
  });
}

export function importCryptoKey(
  exportedKeyString: string,
  keyType: string,
  keyUsages: KeyUsage[],
) {
  return crypto.subtle.importKey(
    format,
    JSON.parse(exportedKeyString),
    { name: keyType },
    true,
    keyUsages,
  );
}
