import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  // ดึง token จาก cookie
  const cookieStore = req.cookies;
  const idToken = cookieStore.get("id_token")?.value;

  if (!idToken) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  let currentUserSub;
  try {
    const payload = jwt.verify(idToken, JWT_SECRET);
    currentUserSub = payload.sub; // sub ของผู้เรียก
  } catch (err) {
    return NextResponse.json({ message: "Invalid token", error: err.message }, { status: 401 });
  }

  // ดึง user info จาก DB
  const userinfo = await prisma.userInfo.findUnique({
    where: { user_id: parseInt(id) },
    include: {
      user: {
        include: {
          bookmark: {
            include: { post: true }
          }
        }
      },
      usergen: {
        include: { genre: true }
      }
    }
  });

  if (!userinfo) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // ตรวจสอบว่าเจ้าของ profile ตรงกับ token หรือไม่
  const isOwner = userinfo.user.cognitoSub === currentUserSub;

  return NextResponse.json({ userinfo, isOwner });
}
