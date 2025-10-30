import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  const cookieStore = await require("next/headers").cookies();
  const idTokenCookie = cookieStore.get("id_token");
  const idToken = idTokenCookie?.value;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  let payload = null;
  if (idToken) {
    try {
      payload = jwt.verify(idToken, JWT_SECRET);
    } catch (err) {
      console.error("Invalid token:", err);
      payload = null;
    }
  }

  try {
    let news = await prisma.posts.findUnique({
      where: { id: parseInt(id) },
      include: {
        comments: true,
        user: true,
        likesPost: true,
        genres: {
          include: { genre: true },
        },
        bookmark: true,
      },
    });

    if (!news) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (payload) {
      // ตรวจสอบว่า user เคย like หรือ bookmark
      const userHasLiked = news.likesPost.some(like => like.whoLikes === payload.sub);
      const userHasBookmarked = news.bookmark.some(book => book.user_sub === payload.sub);

      news = { ...news, userHasLiked, userHasBookmarked, usersub: payload.sub };
    } else {
      news = { ...news, userHasLiked: false, userHasBookmarked: false };
    }

    return NextResponse.json(news);

  } catch (err) {
    console.error("Error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
