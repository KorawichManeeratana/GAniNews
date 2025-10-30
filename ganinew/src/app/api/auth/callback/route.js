// app/api/auth/callback/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify, importJWK, createRemoteJWKSet } from "jose";

const prisma = new PrismaClient();

const REGION = process.env.AWS_REGION; // e.g. "us-east-1"
const COGNITO_DOMAIN = process.env.COGNITO_DOMAIN; // e.g. "your-domain.auth.us-east-1.amazoncognito.com"
const userPoolId = process.env.AWS_USER_POOL_ID;
const CLIENT_ID = process.env.AWS_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.AWS_APP_CLIENT_SECRET || ""; // หากมี client secret
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}api/auth/callback`;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const error = url.searchParams.get("error");
    const error_description = url.searchParams.get("error_description");

    function generateRandomHex(size = 16) {
      const array = new Uint8Array(size);
      crypto.getRandomValues(array); // Web Crypto API
      return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
    }

    if (error === "access_denied") {
      console.log("User canceled login:", error_description);

      // redirect กลับไป Google login อีกครั้ง
      const domain = process.env.COGNITO_DOMAIN;
      const clientId = process.env.AWS_APP_CLIENT_ID;
      const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}api/auth/callback`;
      const state = generateRandomHex(16);
      const nonce = generateRandomHex(16);

      const params = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        redirect_uri: redirectUri /*  */,
        scope: "openid email profile",
        state,
        nonce,
        identity_provider: "Google",
      });

      const redirectUrl = `https://${domain}/oauth2/authorize?${params.toString()}`;
      const res = NextResponse.redirect(redirectUrl);

      res.cookies.set("oauth_state", state, { httpOnly: true, path: "/" });
      res.cookies.set("oauth_nonce", nonce, { httpOnly: true, path: "/" });

      return res;
    }

    const cookieState = req.cookies.get("oauth_state")?.value;
    const cookieNonce = req.cookies.get("oauth_nonce")?.value;

    if (!state || !cookieState || state !== cookieState) {
      return NextResponse.json({ error: "invalid_state" }, { status: 400 });
    }

    if (!code) {
      return NextResponse.json({ error: "missing_code" }, { status: 400 });
    }

    // 1) แลก code เป็น token กับ Cognito
    const tokenUrl = `https://${COGNITO_DOMAIN}/oauth2/token`;
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI, // ← ต้องตรงกับ Callback URL ที่ตั้งใน Cognito
      client_id: CLIENT_ID,
    });

    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    if (CLIENT_SECRET) {
      const creds = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
        "base64"
      );
      headers["Authorization"] = `Basic ${creds}`;
    }

    const tokenRes = await fetch(tokenUrl, {
      method: "POST",
      headers,
      body: body.toString(),
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error("Token endpoint error:", tokenRes.status, text);
      return NextResponse.json(
        { error: "token_exchange_failed", details: text },
        { status: 500 }
      );
    }

    const tokenJson = await tokenRes.json();
    const id_token = tokenJson.id_token;
    const refresh_token = tokenJson.refresh_token;
    const access_token = tokenJson.access_token;

    if (!id_token) {
      return NextResponse.json({ error: "no_id_token" }, { status: 500 });
    }

    const jwksUrl = `https://cognito-idp.${REGION}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
    const JWKS = createRemoteJWKSet(new URL(jwksUrl));

    // Verify token
    const { payload } = await jwtVerify(id_token, JWKS, {
      issuer: `https://cognito-idp.${REGION}.amazonaws.com/${userPoolId}`,
      audience: CLIENT_ID,
    });
    if (payload.token_use !== "id") {
      return NextResponse.json({ error: "invalid_token_use" }, { status: 400 });
    }

    if (payload.nonce !== cookieNonce) throw new Error("Invalid nonce");

    const sub = payload.sub;
    const email = payload.email ?? null;
    const name = payload.name ?? null;
    const picture = payload.picture ?? null;

    if (!sub) throw new Error("No subject in id_token");

    //Upsert user ใน DB ด้วย Prisma
    const user = await prisma.users.upsert({
      where: { cognitoSub: sub },
      update: {
        username: name,
        email,
        userinfo: {
          upsert: {
            update: {}, //login ใหม่ค่าจะได้ไม่ถูกเขัยนทับ
            create: {
              name,
              photo: picture,
              bio: null,
              location: null,
            },
          },
        },
      },
      create: {
        cognitoSub: sub,
        username: name,
        email,
        role: "user",
        userinfo: {
          create: {
            name,
            photo: picture,
            bio: null,
            location: null,
          },
        },
      },
    });

    //สร้าง session cookie
    const res = NextResponse.redirect(baseUrl);
    if (refresh_token) {
      res.cookies.set("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV,
        sameSite: "lax",
        path: "/api",
        maxAge: 30 * 24 * 60 * 60, //30 วัน
      });
    }

    res.cookies.set("id_token", id_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      path: "/",
      sameSite: "lax",
    });

    res.cookies.set("access_token", access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV,
      path: "/",
      maxAge: tokenJson.expires_in, // ตามเวลาหมดอายุที่ Cognito แจ้งมา
    });

    // ลบ oauth_state/nonce cookie ที่ไม่จำเป็นแล้ว
    res.cookies.delete("oauth_state");
    res.cookies.delete("oauth_nonce");

    return res;
  } catch (err) {
    console.error("Callback error:", err);
    return NextResponse.json(
      { error: "callback_failed", message: String(err) },
      { status: 500 }
    );
  }
}
