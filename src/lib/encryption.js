import {
  publicEncrypt,
  createPublicKey,
  privateDecrypt,
  createPrivateKey,
} from "crypto";

export function encryptWithPublicKey(data) {
  const publicKeyPem = process.env.NEXT_PUBLIC_PUBLIC_KEY?.replace(
    /\\n/g,
    "\n",
  );

  if (!publicKeyPem) {
    throw new Error("Public key not configured");
  }

  const publicKey = createPublicKey(publicKeyPem);
  const encrypted = publicEncrypt(
    {
      key: publicKey,
      padding: 4,
    },
    Buffer.from(data, "utf8"),
  );

  return encrypted.toString("base64");
}

export function decryptWithPrivateKey(encryptedData) {
  const privateKeyPem = process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  );

  if (!privateKeyPem) {
    throw new Error("Private key not configured");
  }

  const privateKey = createPrivateKey(privateKeyPem);
  const decrypted = privateDecrypt(
    {
      key: privateKey,
      padding: 4,
    },
    Buffer.from(encryptedData, "base64"),
  );

  return decrypted.toString("utf8");
}
