'use server';
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export default async function updateProfile(formData) {
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
    const name = formData.get("name");
    const email = formData.get("email");
    const location = formData.get("location");
    const bio = formData.get("bio");
    const genresform = formData.get("genres");
    const file = formData.get("file"); // ไฟล์ใหม่จาก form
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
        // ดึงข้อมูล userInfo เดิมเพื่อตรวจสอบรูปเก่า
        const oldInfo = await prisma.users.findUnique({
            where: { cognitoSub: userSub },
            include: { userinfo: true },
        });

        let oldImageUrl = oldInfo?.userinfo?.photo || null;
        let fileUrl = oldImageUrl;

        // ลบไฟล์เก่าจาก S3 ถ้ามีไฟล์ใหม่
        if (file && file.size > 0 && oldImageUrl) {
            const h = await headers();
            const host = h.get("host");
            const protocol = process.env.NODE_ENV === 'production' ? "http" : "https";
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

        // อัปโหลดไฟล์ใหม่
        if (file && file.size > 0) {
            const uploadForm = new FormData();
            uploadForm.append("file", file);

            const h = await headers();
            const host = h.get("host");
            const protocol = process.env.NODE_ENV === 'production' ? "http" : "https";
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

        // อัปเดต email ใน users
        if (email) {
            await prisma.users.update({
                where: { cognitoSub: userSub },
                data: { email },
            });
        }

        // อัปเดตหรือสร้าง userInfo
        const userInfoExists = await prisma.users.findUnique({
            where: { cognitoSub: userSub },
            include: { userinfo: true },
        });

        if (!userInfoExists.userinfo) {
            insertdata = await prisma.userInfo.create({
                data: { ...checkdata, user_id: userInfoExists.id, photo: fileUrl },
                select: { id: true },
            });
        } else {
            insertdata = await prisma.userInfo.update({
                where: { user_id: userInfoExists.userinfo.id },
                data: { ...checkdata, photo: fileUrl },
                select: { id: true },
            });
        }

        // อัปเดต genres
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

        redirect(`/profile/${userInfoExists.id}`);
    } catch (err) {
        if (err.digest?.startsWith("NEXT_REDIRECT")) throw err;
        console.error("Update profile error:", err);
        throw new Error("Something went wrong!");
    }
}
