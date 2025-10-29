import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const posts = await prisma.posts.findMany({
      include: {
        user: true,          // ดึงข้อมูล Users ของโพสต์
        comments: true,      // ดึง Comments ทั้งหมด
        genres: {            // ดึง Genres ผ่าน genrespost
          include: {
            genre: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",  // เรียงตามวันล่าสุด
      },
    })

    return NextResponse.json(posts);
  } catch (err) {
    console.error("Error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}