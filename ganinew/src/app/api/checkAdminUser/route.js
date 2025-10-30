import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  const cookieStore = req.cookies;
  const idToken = cookieStore.get("id_token")?.value;

  if (!idToken) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  let payload;
  try {
    payload = jwt.verify(idToken, JWT_SECRET);
  } catch (err) {
    return NextResponse.json({ message: "Invalid token", error: err.message }, { status: 401 });
  }

  // หา user ใน DB ด้วย sub จาก JWT ของเรา
  const user = await prisma.users.findUnique({
    where: { cognitoSub: payload.sub }, // ใช้ sub จาก JWT ของเราเอง
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (user.role !== "admin") {
    return NextResponse.json({ message: "Access denied" }, { status: 403 });
  }

  return NextResponse.json(user, { status: 200 });
}
