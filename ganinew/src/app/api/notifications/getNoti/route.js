import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const posts = await prisma.notification.findMany({
      orderBy: {
        create_at: "desc",  // เรียงตามวันล่าสุด
      },
    })

    return NextResponse.json(posts);
  } catch (err) {
    console.error("Error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}