// app/api/auth/start/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  try {
    // config from env
    const domain = process.env.COGNITO_DOMAIN;
    const clientId = process.env.AWS_APP_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}api/auth/callback`;
    const state = crypto.randomBytes(16).toString("hex");
    const nonce = crypto.randomBytes(16).toString("hex");
  
    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: "openid email profile",
      state,
      nonce,
      // ให้เลือก provider เป็น Google โดยตรง
      identity_provider: "Google",
    });

    // สร้าง response ที่ redirect ไป hosted ui
    const redirectUrl = `https://${domain}/oauth2/authorize?${params.toString()}`;
    const res = NextResponse.redirect(redirectUrl);

    // เซ็ต state/nonce เป็น HttpOnly cookie เพื่อให้ตรวจตอน callback
    const isProd = process.env.NODE_ENV ;
    res.cookies.set("oauth_state", state, { httpOnly: true, secure: isProd, path: "/", sameSite: "lax" });
    res.cookies.set("oauth_nonce", nonce, { httpOnly: true, secure: isProd, path: "/", sameSite: "lax" });

    return res;
  } catch (err) {
    console.error("Start OAuth error:", err);
    return NextResponse.json({ error: "start_failed" }, { status: 500 });
  }
}
