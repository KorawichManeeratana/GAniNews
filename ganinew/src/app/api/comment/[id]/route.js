import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const postId = Number(params.id);

  if (isNaN(postId)) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { post_id: postId, parent_id: null },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            userinfo: { select: { name: true, photo: true } },
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                userinfo: { select: { name: true, photo: true } },
              },
            },
          },
        },
      },
      orderBy: { id: "desc" },
    });

    comments.forEach((c) => {
      if (c.replies?.length) {
        c.replies.sort((a, b) => a.id - b.id);
      }
    });

    return NextResponse.json(comments);
  } catch (err) {
    console.error("GET /api/comment error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const postId = Number(params.id);

  if (isNaN(postId)) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { detail, user_id, parent_id } = body;

    if (!detail || !user_id) {
      return NextResponse.json(
        { error: "Missing required fields: detail, user_id" },
        { status: 400 }
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        post_id: postId,
        user_id: Number(user_id),
        detail,
        parent_id: parent_id ? Number(parent_id) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            userinfo: { select: { name: true, photo: true } },
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                userinfo: { select: { name: true, photo: true } },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(newComment);
  } catch (err) {
    console.error("POST /api/comment error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
