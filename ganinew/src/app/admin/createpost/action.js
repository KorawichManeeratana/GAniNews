'use server'
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

const prisma = new PrismaClient()

export default async function createPost(formData) {
    const title = formData.get('title')
    const category = formData.get('category')
    const content = formData.get('content')
    const genresform = formData.get('genres')
    const description = formData.get('description')
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
            return NextResponse.json({ error: 'File upload failed' }, { status: 400 })
        }
    }

    try {
        genres = JSON.parse(genresform);
    } catch {
        genres = [];
    }

    try {
        const insertdata = await prisma.Posts.create({
            data: {
                title: title,
                body: content,
                category: category,
                description : description,
                image : fileUrl,
                user: {
                    connect: { id: 1 } 
                    }
                },
            select: {
                id: true
            }
        })

        if (genres.length > 0) {
            await Promise.all(
                genres.map(genid =>
                    prisma.genrespost.create({
                        data: {
                            gen_id: Number(genid),
                            post_id: insertdata.id
                        }
                    })
                )
            )
        }

        await prisma.notification.create({
            data:{
                title : title,
                content : description,
                url_post : `/newsDetail/${insertdata.id}`,
                post_id: insertdata.id
            }
        })
        redirect("/admin")
    } catch (err) {
        if (err.digest?.startsWith("NEXT_REDIRECT")) {
            throw err;
        }
        console.error(err);
        throw new Error("Someting Wrong!");
    }
}
