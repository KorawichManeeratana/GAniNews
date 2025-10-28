import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify, createRemoteJWKSet } from "jose";

const region = process.env.AWS_REGION;
const userPoolId = process.env.AWS_USER_POOL_ID;
const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
const JWKS = createRemoteJWKSet(new URL(jwksUrl));

export async function GET(req) {
  const cookieStore = await require("next/headers").cookies();
  const idTokenCookie = cookieStore.get("id_token");
  const idToken = idTokenCookie?.value;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const { payload } = await jwtVerify(idToken, JWKS, {
        issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
        audience: process.env.AWS_APP_CLIENT_ID,
    });

  try {
    var news = await prisma.posts.findUnique({
      where: { id: parseInt(id) },
      include: {
        comments: true,
        user: true,
        likesPost: true,
        genres: {
          include: {
            genre: true, //field นี้ตรงกับ model genrespost
          },
        },
      },
    });

    if (payload){
      if (payload.sub in news.likesPost.map(like => like.whoLikes)){
        news = {...news, userHasLiked: true}
      } else {
        news = {...news, userHasLiked: false}
      }

      const withuser = {...news, usersub : payload.sub};
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
