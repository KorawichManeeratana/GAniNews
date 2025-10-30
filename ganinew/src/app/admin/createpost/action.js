"use server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export default async function createPost(formData) {
  // อ่าน cookie server-side
  const cookieStore = await require("next/headers").cookies();
  const idTokenCookie = cookieStore.get("id_token");
  const idToken = idTokenCookie?.value;

  if (!idToken) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  let payload;
  try {
    payload = jwt.verify(idToken, JWT_SECRET);
  } catch (err) {
    return NextResponse.json({ message: "Invalid token", error: err.message }, { status: 401 });
  }

  const userSub = payload.sub;

  // ดึงค่า form data
  const title = formData.get("title");
  const category = formData.get("category");
  const content = formData.get("content");
  const genresform = formData.get("genres");
  const description = formData.get("description");
  const images = formData.get("image");
  let genres = [];
  const file = formData.get("file");
  let fileUrl = null;

  if (file) {
    const uploadForm = new FormData();
    uploadForm.append("file", file);

    const h = await headers();
    const host = h.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    try {
      const res = await fetch(`${baseUrl}/api/s3-upload`, {
        method: "POST",
        body: uploadForm,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      fileUrl = data.url;
    } catch (err) {
      console.error("Upload error:", err);
      return NextResponse.json({ error: "File upload failed" }, { status: 400 });
    }
  }

  genres = genresform ? JSON.parse(genresform) : [];

  try {
    // สร้าง post และเชื่อมกับ user โดยใช้ JWT ของเราเอง
    const insertdata = await prisma.posts.create({
      data: {
        title: title,
        body: content,
        category: category,
        description: description,
        image: fileUrl,
        user: {
          connect: { cognitoSub: userSub }, // ใช้ sub จาก JWT ของเราเอง
        },
      },
      select: {
        id: true,
      },
    });

    // เชื่อม genres
    if (genres.length > 0) {
      await Promise.all(
        genres.map((genid) =>
          prisma.genrespost.create({
            data: {
              gen_id: Number(genid),
              post_id: insertdata.id,
            },
          })
        )
      );
    }

    // สร้าง notification
    await prisma.notification.create({
      data: {
        title: title,
        content: description,
        url_post: `/newsDetail/${insertdata.id}`,
        post_id: insertdata.id,
      },
    });

    redirect("/admin");
  } catch (err) {
    if (err.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.error(err);
    throw new Error("Something went wrong!");
  }
}
