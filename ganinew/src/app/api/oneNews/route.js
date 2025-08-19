import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  console.log("id:", id)
  try {
    const news = await prisma.posts.findUnique({
      where: { id: parseInt(id) }, // ต้องมั่นใจว่า id ไม่เป็น NaN
      include: {
        comments: true,
        genres: {
          include: {
            genre: true, // ← field นี้ตรงกับ model genrespost
          },
        },
      },
    });
    console.log("data:", news);
    return NextResponse.json(news);
  } catch (err) {
    console.error("Error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
