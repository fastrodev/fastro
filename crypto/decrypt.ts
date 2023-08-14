export function decryptData(
  key: CryptoKey,
  encryptedData: string,
) {
  const encryptedDataArray = new Uint8Array(
    atob(encryptedData).split("").map((char) => char.charCodeAt(0)),
  );
  return crypto.subtle.decrypt(
    { name: key.algorithm.name, iv: new Uint8Array(12) },
    key,
    encryptedDataArray,
  ).then((decryptedData) => {
    return new TextDecoder().decode(decryptedData);
  });
}
