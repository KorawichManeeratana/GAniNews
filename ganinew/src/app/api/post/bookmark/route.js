import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const body = await req.json();
    const { postId, isBookmarked } = body || {};

    if (typeof postId !== "number" || typeof isBookmarked !== "boolean") {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    // อ่าน cookie server-side
    const cookieStore = await require("next/headers").cookies();
    const idTokenCookie = cookieStore.get("id_token");
    const idToken = idTokenCookie?.value;

    if (!idToken) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    // ตรวจสอบ JWT ของเราเอง
    let payload;
    try {
      payload = jwt.verify(idToken, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token", error: err.message }, { status: 401 });
    }

    const userSub = payload.sub;

    if (isBookmarked) {
      // เพิ่ม bookmark
      await prisma.bookmark.create({
        data: { user_sub: userSub, post_id: postId },
      });
    } else {
      // ลบ bookmark
      await prisma.bookmark.deleteMany({
        where: { post_id: postId, user_sub: userSub },
      });
    }

    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (err) {
    console.error("Error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
