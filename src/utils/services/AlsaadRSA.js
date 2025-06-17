import forge from "node-forge";

const publicKeyPem =
  process.env.NEXT_PUBLIC_PUBLIC_KEY?.replace(/\\n/g, "\n") || "";
const privateKeyPem = process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(
  /\\n/g,
  "\n",
);

export const encryptData = (plainText) => {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encrypted = publicKey.encrypt(plainText, "RSAES-PKCS1-V1_5");
  console.log(encrypted, "encrypted");

  return forge.util.encode64(encrypted);
};

export const decryptData = (encryptedMessage) => {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const decodedMessage = forge.util.decode64(encryptedMessage);
  const decrypted = privateKey.decrypt(decodedMessage, "RSAES-PKCS1-V1_5");
  console.log(decrypted, "decrypted");

  return decrypted;
};
