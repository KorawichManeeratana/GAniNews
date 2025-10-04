import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify, createRemoteJWKSet } from "jose";

const region = process.env.AWS_REGION;
const userPoolId = process.env.AWS_USER_POOL_ID;
const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
const JWKS = createRemoteJWKSet(new URL(jwksUrl));

export async function GET(req) {
  const cookieStore = require("next/headers").cookies();
  const idTokenCookie = cookieStore.get("id_token");
  const idToken = idTokenCookie?.value;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const { payload } = await jwtVerify(idToken, JWKS, {
        issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
        audience: process.env.AWS_APP_CLIENT_ID,
    });

  try {
    const news = await prisma.posts.findUnique({
      where: { id: parseInt(id) },
      include: {
        comments: true,
        user: true,
        genres: {
          include: {
            genre: true, //field นี้ตรงกับ model genrespost
          },
        },
      },
    });

    if (payload){
      const withuser = {
        news: news,
        userSub: payload.sub,
      }
      return NextResponse.json(withuser);
      }
    else{
      return NextResponse.json(news);
    }

    
  } catch (err) {
    console.error("Error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
