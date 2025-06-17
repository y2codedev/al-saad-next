import forge from "node-forge";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { encrypted } = await req.json();
    if (!process.env.NEXT_PUBLIC_PUBLIC_KEY) {
      throw new Error("Missing environment variable: NEXT_PUBLIC_PRIVATE_KEY");
    }

    const privateKeyPem = (process.env.NEXT_PUBLIC_PRIVATE_KEY || "")?.replace(
      /\\n/g,
      "\n",
    );

    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const decoded = forge.util.decode64(encrypted);
    const decrypted = privateKey.decrypt(decoded, "RSAES-PKCS1-V1_5");

    return NextResponse.json({ decrypted });
  } catch (error) {
    return NextResponse.json(
      { error: "Decryption failed", detail: error.message },
      { status: 500 },
    );
  }
};
