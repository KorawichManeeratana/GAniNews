import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const body = await req.json();
    const { postId, isLiked } = body || {};

    if (typeof postId !== "number" || typeof isLiked !== "boolean") {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    // อ่าน cookie server-side
    const cookieStore = await require("next/headers").cookies();
    const idTokenCookie = cookieStore.get("id_token");
    const idToken = idTokenCookie?.value;

    if (!idToken) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    // Verify JWT ของเราเอง
    let payload;
    try {
      payload = jwt.verify(idToken, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token", error: err.message }, { status: 401 });
    }

    const userSub = payload.sub;

    if (isLiked) {
      // เพิ่มไลค์
      await prisma.$transaction([
        prisma.likes.create({
          data: { whoLikes: userSub, post_id: postId },
        }),
        prisma.posts.update({
          where: { id: postId },
          data: { likes: { increment: 1 } }, // เพิ่มค่า likes +1
        }),
      ]);
    } else {
      // ลบไลค์
      await prisma.$transaction([
        prisma.likes.deleteMany({
          where: { whoLikes: userSub, post_id: postId },
        }),
        prisma.posts.update({
          where: { id: postId },
          data: { likes: { decrement: 1 } }, // ลดค่า likes -1
        }),
      ]);
    }

    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (err) {
    console.error("Error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
