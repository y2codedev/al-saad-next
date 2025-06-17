import forge from "node-forge";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin":
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function POST(req) {
  try {
    
    const body = await req.json();
    const { password } = body;

    if (!process.env.NEXT_PUBLIC_PUBLIC_KEY) {
      throw new Error("Missing environment variable: NEXT_PUBLIC_PUBLIC_KEY");
    }

    const publicKeyPem = (process.env.NEXT_PUBLIC_PUBLIC_KEY || "")?.replace(
      /\\n/g,
      "\n",
    );

    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encrypted = publicKey.encrypt(password, "RSAES-PKCS1-V1_5");
    const encoded = forge.util.encode64(encrypted);

    return new NextResponse(JSON.stringify({ encrypted: encoded }), {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "Encryption failed",
        detail: error.message,
      }),
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
