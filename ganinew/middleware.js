import { NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from 'jose';

const region = process.env.AWS_REGION;
const userPoolId = process.env.AWS_USER_POOL_ID;
const CLIENT_ID = process.env.AWS_APP_CLIENT_ID;

const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
const JWKS = createRemoteJWKSet(new URL(jwksUrl));

export async function middleware(req) {
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Decode access token
  const { payload } = await jwtVerify(accessToken, JWKS, {
        issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
        audience: CLIENT_ID,
    });

  const now = Date.now() / 1000;
  console.log("Payload", payload);

  // ถ้า access token หมดอายุแล้ว
  if (payload.exp < now) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // เรียก API เพื่อ refresh token ใหม่
    const refreshResponse = await fetch(`${req.nextUrl.origin}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshResponse.ok) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const { access_token: newAccessToken } = await refreshResponse.json();

    // อัปเดต cookie ใหม่
    const response = NextResponse.next();
    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
    });

    return response;
  }

  return NextResponse.next();
}

// เลือก path ที่ต้องการให้ middleware ทำงาน
export const config = {
  matcher: [
    // ตรวจทุก route ที่ใช่พวกนี้
    "/((?!login|register|public|_next/static|_next/image|favicon.ico).*)",
  ],
};
