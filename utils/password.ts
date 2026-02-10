export function uint8ArrayToBase64(u8: Uint8Array): string {
  return btoa(String.fromCharCode(...u8));
}

export function base64ToUint8Array(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

export async function hashPassword(
  password: string,
): Promise<{ salt: string; hash: string }> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as unknown as BufferSource,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );
  const hash = new Uint8Array(derived);
  return { salt: uint8ArrayToBase64(salt), hash: uint8ArrayToBase64(hash) };
}

export async function verifyPassword(
  password: string,
  saltB64: string,
  expectedHashB64: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const salt = base64ToUint8Array(saltB64);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as unknown as BufferSource,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );
  const hash = uint8ArrayToBase64(new Uint8Array(derived));
  return hash === expectedHashB64;
}
