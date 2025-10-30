import { PrismaClient } from "@prisma/client";
import { jwtVerify, createRemoteJWKSet } from "jose";
import { NextResponse } from "next/server";


const prisma = new PrismaClient();
const region = process.env.AWS_REGION;
const userPoolId = process.env.AWS_USER_POOL_ID;
const clientId = process.env.AWS_APP_CLIENT_ID;
const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
const JWKS = createRemoteJWKSet(new URL(jwksUrl));

export async function GET(req) {
  const cookieStore = req.cookies;
  const idToken = cookieStore.get("id_token")?.value;

  if (!idToken) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { payload } = await jwtVerify(idToken, JWKS, {
    issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
    audience: clientId,
  });

  if (payload.token_use !== "id") {
    return NextResponse.json({ message: "Invalid token use" }, { status: 401 });
  }

  const user = await prisma.users.findUnique({
    where: {
      cognitoSub: payload.sub,
    },
  });

  if (user?.role !== "admin") {
    return NextResponse.json({ message: "Access denied" }, { status: 403 });
  }

  return Response.json(user);
}
