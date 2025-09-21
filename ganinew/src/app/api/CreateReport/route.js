import { NextResponse } from "next/server"
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { postId, topics, detail, userId } = body;

    console.log("postId:", postId)
    console.log("userId:", userId)
    console.log("topics:", topics)
    console.log("detail:", detail)


    if (!postId || !Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const newReport = await prisma.reports.create({
      data: {
        subject: topics.join(", "),
        detail: detail ?? null,
        from_user: userId,
        post_id: postId,
        comment_id: null,
        status: "pending",
      },
    });

    return NextResponse.json({ report: newReport }, { status: 201 });
  } catch (err) {
    console.error("POST /api/reports error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
