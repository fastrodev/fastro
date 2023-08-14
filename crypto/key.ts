const format = "jwk";

export const keyType = "AES-GCM";
export const keyUsages: KeyUsage[] = ["encrypt", "decrypt"];
export const SALT = `o5cf9eb92`;
export function reverseString(str: string) {
  return str.split("").reverse().join("").replace("}", "").replace("{", "");
}
export function addSalt(inputString: string, salt: string) {
  return salt + inputString + salt;
}
export function clean(v: string) {
  return v.replace("{", "").replace("}", "");
}
export function closeMe(v: string) {
  return "{" + v + "}";
}
export function extractOriginalString(saltedString: string, salt: string) {
  if (saltedString.startsWith(salt) && saltedString.endsWith(salt)) {
    const withoutSalt = saltedString.slice(salt.length, -salt.length);
    return withoutSalt;
  } else {
    console.log("Salt doesn't match.");
    return null;
  }
}

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
