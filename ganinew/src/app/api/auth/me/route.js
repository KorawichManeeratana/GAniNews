// app/api/auth/me/route.js
import { NextResponse } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";
import prisma from "@/lib/prisma";

const region = process.env.AWS_REGION;
const userPoolId = process.env.AWS_USER_POOL_ID;
const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
const JWKS = createRemoteJWKSet(new URL(jwksUrl));

export async function GET(req) {
  try {
    // อ่าน cookie server-side
    const cookieStore = await require("next/headers").cookies();
    const idTokenCookie = cookieStore.get("id_token");
    const idToken = idTokenCookie?.value;


    if (!idToken) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    // Verify JWT
    const { payload } = await jwtVerify(idToken, JWKS, {
      issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
      audience: process.env.AWS_APP_CLIENT_ID,
    });

    // ตรวจสอบ token_use
    if (payload.token_use !== "id") {
      return NextResponse.json({ message: "Invalid token use" }, { status: 401 });
    }

    const sub = payload.sub;
    if (!sub) return NextResponse.json({ message: "Invalid token payload" }, { status: 401 });

    const user = await prisma.users.findUnique({
      where: { cognitoSub: sub },
      include: { userinfo: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const safeUser = { //เลือกข้อมูลที่จะส่งกลับ เราเอาไว้เผื่อไม่อยากส่งข้อมูลบางอย่างกลับไป
      id: user.id,
      role: user.role,
      user_info: user.userinfo,
    };



    return NextResponse.json({ ok: true, user: safeUser }, { status: 200 });
  } catch (err) {
    console.error("auth/me error:", err); //จะได้รู้ว่า error ที่ไหน และ อะไร
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
