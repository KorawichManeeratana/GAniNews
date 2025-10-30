import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify, createRemoteJWKSet } from "jose";

const region = process.env.AWS_REGION;
const userPoolId = process.env.AWS_USER_POOL_ID;
const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
const JWKS = createRemoteJWKSet(new URL(jwksUrl));

export async function POST(req) {
  try {
    const body = await req.json();
    const { postId, isBookmarked } = body || {};

    if (typeof postId !== "number" || typeof isBookmarked !== "boolean") {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const cookieStore = await require("next/headers").cookies();
    const idTokenCookie = cookieStore.get("id_token");
    const idToken = idTokenCookie?.value;

    if (!idToken) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    const { payload } = await jwtVerify(idToken, JWKS, {
      issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
      audience: process.env.AWS_APP_CLIENT_ID,
    });

    if (payload.token_use !== "id") {
      return NextResponse.json(
        { message: "Invalid token use" },
        { status: 401 }
      );
    }

    if (isBookmarked) {
      //เพิ่ม bookmark
      await prisma.bookmark.create({
        data: { user_sub: payload.sub, post_id: postId },
      });
    } else {
      // ลบ
      await prisma.bookmark.deleteMany({
        where: { post_id: postId, user_sub: payload.sub },
      });
      return NextResponse.json({ ok: true }, { status: 200 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
