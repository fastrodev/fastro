export function encryptData(
  key: CryptoKey,
  plaintext: string,
) {
  const data = new TextEncoder().encode(plaintext);
  return crypto.subtle.encrypt(
    { name: key.algorithm.name, iv: new Uint8Array(12) },
    key,
    data,
  ).then((encryptedData) => {
    return btoa(
      String.fromCharCode(...new Uint8Array(encryptedData)),
    );
  });
}
