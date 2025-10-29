'use server';
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export default async function updatePost(formData) {
    const postId = Number(formData.get("postid"));
    const title = formData.get("title");
    const category = formData.get("category");
    const content = formData.get("content");
    const genresform = formData.get("genres");
    const description = formData.get("description");
    const file = formData.get("file"); // ตัวไฟล์จาก form

    let rawgenres = [];
    try {
        rawgenres = JSON.parse(genresform);
    } catch {
        rawgenres = [];
    }
    const genres = [...new Set(rawgenres)];

    try {
        const oldPost = await prisma.posts.findUnique({
            where: { id: postId },
            select: { image: true },
        });

        let fileUrl = oldPost?.image;

        // ลบรูปเก่า ถ้ามีไฟล์ใหม่
        if (file && oldPost?.image) {
            const h = await headers();
            const host = h.get("host");
            const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
            const baseUrl = `${protocol}://${host}`;

            try {
                const res = await fetch(`${baseUrl}/api/s3-delete`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ imageUrl: oldPost.image }),
                });
                if (!res.ok) throw new Error("Delete failed");
            } catch (err) {
                console.error("Delete error:", err);
            }
        }

        // อัปโหลดไฟล์ใหม่
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

        // อัปเดตโพสต์ใน DB
        await prisma.posts.update({
            where: { id: postId },
            data: {
                title,
                body: content,
                category,
                description,
                image: fileUrl,
            },
        });

        // อัปเดต genres
        await prisma.genrespost.deleteMany({ where: { post_id: postId } });
        if (genres.length > 0) {
            await Promise.all(
                genres.map((genid) =>
                    prisma.genrespost.create({
                        data: { gen_id: Number(genid), post_id: postId },
                    })
                )
            );
        }

        redirect("/admin");
    } catch (err) {
        if (err.digest?.startsWith("NEXT_REDIRECT")) {
            throw err;
        }
        console.error(err);
        throw new Error("Someting Wrong!");
    }
}
