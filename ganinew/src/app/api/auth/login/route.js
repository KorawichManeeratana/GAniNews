import { createRemoteJWKSet, jwtVerify } from 'jose';
import crypto from "crypto";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { NextResponse } from "next/server"

const region = process.env.AWS_REGION;
const client = new CognitoIdentityProviderClient({
  region: region,
});
const userPoolId = process.env.AWS_USER_POOL_ID;
const CLIENT_ID = process.env.AWS_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.AWS_APP_CLIENT_SECRET || "";

function calcSecretHash(username, clientId, clientSecret) {
  if (!clientSecret) return undefined;
  return crypto
    .createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
const JWKS = createRemoteJWKSet(new URL(jwksUrl));

export async function POST(req) {

  try {
    // ต้อง await .json() ใน App Router
    const body = await req.json();

    const { email, password } = body || {};
    if (!email || !password) {
      return new Response(JSON.stringify({ message: "Missing email/password" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const secretHash = calcSecretHash(email, CLIENT_ID, CLIENT_SECRET);
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: CLIENT_ID,
      AuthParameters: { USERNAME: email, PASSWORD: password },
    };

    if (secretHash) params.AuthParameters.SECRET_HASH = secretHash;

    const resp = await client.send(new InitiateAuthCommand(params));

    if (!resp.AuthenticationResult) {
      return NextResponse.json(
        { message: "Additional action required", challenge: resp.ChallengeName || null, details: resp },
        { status: 202 }
      );
    }

    const { RefreshToken, IdToken, AccessToken, ExpiresIn } = resp.AuthenticationResult;
    if (!IdToken) {
      return NextResponse.json({ message: "No IdToken returned" }, { status: 500 });
    }

    const { payload } = await jwtVerify(IdToken, JWKS, {
      issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
      audience: CLIENT_ID,
    });


    if (payload.token_use !== "id") {
      return NextResponse.json({ message: "Unexpected token use" }, { status: 400 });
    }

    const res = NextResponse.json(
      { status: "OK", user: { sub: payload.sub, email: payload.email } },
      { status: 200 }
    );
    
    const isProd = process.env.NODE_ENV;

    if (RefreshToken) {
    res.cookies.set("refresh_token", RefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/api",
      maxAge: 60 * 60 * 24 * 30, //30 วัน
    });
  }

    res.cookies.set("id_token", IdToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: ExpiresIn,
    });

    res.cookies.set("access_token", AccessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: ExpiresIn,
    });

    return res;
  } catch (err) {
    console.error("Cognito login error:", err);
    return NextResponse.json({ message: err?.message || "Login failed", status: "ERROR" }, {
      status: 400
    });
  }
}
