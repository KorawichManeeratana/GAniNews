import { NextResponse } from "next/server"


import crypto from "crypto";
import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

function calculateSecretHash(username, clientId, clientSecret) {
  return crypto.createHmac("sha256", clientSecret).update(username + clientId).digest("base64");
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, confirmationCode } = body ?? {};

    if (!username || !confirmationCode) {
      return NextResponse.json({ message: "username and confirmationCode are required." }, {status: 400});
    }

    const clientId = process.env.AWS_APP_CLIENT_ID || process.env.AWS_APP_CLIENT_ID;


    if (!clientId) {
      return NextResponse.json({ message: "ClientId not configured in env." }, {status: 500});
    }

    const params = {
      ClientId: clientId,
      Username: username,
      ConfirmationCode: confirmationCode,
    };

    const clientSecret = process.env.AWS_APP_CLIENT_SECRET;
    if (clientSecret) {
      params.SecretHash = calculateSecretHash(username, clientId, clientSecret);
    }

    const command = new ConfirmSignUpCommand(params);
    await client.send(command);

    return NextResponse.json({ message: "User confirmed successfully." }, {status: 200});
  } catch (err) {
    console.error("ConfirmSignUp error:", err);

    // แมพ error ของ Cognito ให้ข้อความเข้าใจง่าย
    const name = err?.name;
    let status = 400;
    let message = err?.message || "Error confirming user";

    if (name === "CodeMismatchException") {
      message = "Invalid confirmation code.";
    } else if (name === "ExpiredCodeException") {
      message = "Confirmation code has expired. Please request a new code.";
    } else if (name === "NotAuthorizedException") {
      message = "User cannot be confirmed (not authorized).";
    } else if (name === "UserNotFoundException") {
      message = "User not found.";
    } else if (name === "InvalidParameterException") {
      message = "Invalid parameter.";
    } else if (name === "TooManyFailedAttemptsException" || name === "TooManyRequestsException") {
      message = "Too many attempts. Try again later.";
    } else if (name === "InternalErrorException") {
      status = 500;
    }

    return NextResponse.json({ message }, {status});
  }
}
