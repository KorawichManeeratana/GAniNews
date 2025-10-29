'use server';

import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export default async function updateProfile(formData) {
  const user_id = 1; // ในโปรเจกต์จริงควรดึงจาก session หรือ token

  const name = formData.get("name");
  const email = formData.get("email");
  const location = formData.get("location");
  const bio = formData.get("bio");
  const genresform = formData.get("genres");
  const file = formData.get("file"); // 🟣 ไฟล์ใหม่จาก form

  let insertdata;
  let genres = [];

  try {
    genres = JSON.parse(genresform || "[]");
  } catch {
    genres = [];
  }

  // สร้าง object ของข้อมูลที่อัปเดต
  const checkdata = Object.fromEntries(
    Object.entries({ name, location, bio }).filter(([_, v]) => v)
  );

  try {
    // 🔹 ดึงข้อมูล userInfo เดิมเพื่อตรวจสอบรูปเก่า
    const oldInfo = await prisma.userInfo.findUnique({
      where: { user_id },
      select: { photo: true },
    });

    let oldImageUrl = oldInfo?.photo || null;
    let fileUrl = oldImageUrl;

    // 🔹 ถ้ามีไฟล์ใหม่ → ลบไฟล์เก่าออกจาก S3
    if (file && oldImageUrl) {
      const h = await headers();
      const host = h.get("host");
      const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
      const baseUrl = `${protocol}://${host}`;

      try {
        const res = await fetch(`${baseUrl}/api/s3-delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: oldImageUrl }),
        });
        if (!res.ok) throw new Error("Delete failed");
      } catch (err) {
        console.error("S3 delete error:", err);
      }
    }

    // 🔹 ถ้ามีไฟล์ใหม่ → อัปโหลดขึ้น S3
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
        checkdata.photo = fileUrl;
      } catch (err) {
        console.error("S3 upload error:", err);
        return NextResponse.json({ error: "File upload failed" }, { status: 400 });
      }
    }

    // 🔹 อัปเดต email ใน users
    if (email) {
      await prisma.users.update({
        where: { id: user_id },
        data: { email },
      });
    }

    // 🔹 อัปเดตหรือสร้าง userInfo
    const userInfoExists = await prisma.userInfo.findUnique({ where: { user_id } });

    if (!userInfoExists) {
      insertdata = await prisma.userInfo.create({
        data: { ...checkdata, user_id, photo: fileUrl },
        select: { id: true },
      });
    } else {
      insertdata = await prisma.userInfo.update({
        where: { user_id },
        data: { ...checkdata, photo: fileUrl },
        select: { id: true },
      });
    }

    // 🔹 อัปเดต genres
    await prisma.userGen.deleteMany({ where: { userinfo_id: insertdata.id } });
    if (genres.length > 0) {
      await Promise.all(
        genres.map((genid) =>
          prisma.userGen.create({
            data: { gen_id: Number(genid), userinfo_id: insertdata.id },
          })
        )
      );
    }

    redirect("/profile");
  } catch (err) {
    if (err.digest?.startsWith("NEXT_REDIRECT")) throw err;
    console.error("Update profile error:", err);
    throw new Error("Something went wrong!");
  }
}
