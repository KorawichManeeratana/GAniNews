import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION, // region ของ user pool ที่ใช้เด้อ
});

function calculateSecretHash(username, clientId, clientSecret) {
  return crypto.createHmac("sha256", clientSecret).update(username + clientId).digest("base64");//จำเป็นต้อง Hash ก่อนส่งไปที่ Cognito นะครัช
}

export async function POST(req) {
  const { username, email, password, confirmPassword } = await req.json();

  const clientId = process.env.AWS_APP_CLIENT_ID;
  const clientSecret = process.env.AWS_APP_CLIENT_SECRET;

  if (!email || !password || !confirmPassword || !username) {
    return NextResponse.json({ message: "User Data required." },{status: 400});
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ message: "Passwords do not match." } ,{status: 400});
  }

   const params = {
      ClientId: clientId,
      Username: username,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
      ],
    };

    if (clientSecret) {
      params.SecretHash = calculateSecretHash(username, clientId, clientSecret);
    }


  try {
    const command = new SignUpCommand(params);
    const response = await client.send(command);

    const sub = response.UserSub;

    if (!sub) throw new Error("Cognito sub not found");

    const user = await prisma.users.upsert({
      where: { cognitoSub: sub },
      update: {
        username: username,
        email,
        userinfo: {
          upsert: {
            update: {
              name: username,
              photo: "https://i.pinimg.com/1200x/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg",
              // bio, location สามารถใส่ default หรือ null
            },
            create: {
              name: username,
              photo: "https://i.pinimg.com/1200x/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg",
              bio: null,
              location: null,
            },
          },
        },
      },
      create: {
        cognitoSub: sub,
        username: username,
        email,
        role: "user",
        userinfo: {
          create: {
            name: username,
            photo: "https://i.pinimg.com/1200x/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg",
            bio: null,
            location: null,
          },
        },
      },
    });


    return NextResponse.json({
      message: "User registered successfully",
      userSub: response.UserSub,
      userConfirmed: response.UserConfirmed}, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: error.message || "Error registering user"}, {status: 400});
  }
}