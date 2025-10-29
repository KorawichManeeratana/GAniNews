'use server'
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export default async function deletepost(formData) {
    const postid = formData.get("postid");

    try {
        const post = await prisma.posts.findUnique({
            where: { id: Number(postid) },
            select: { image: true },
        });

        if (post?.image) {
            const h = await headers();
            const host = h.get("host");
            const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
            const baseUrl = `${protocol}://${host}`;

            try {
                const res = await fetch(`${baseUrl}/api/s3-delete`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ imageUrl: post.image }),
                });

                if (!res.ok) {
                    console.error("S3 delete failed:", await res.text());
                }
            } catch (err) {
                console.error("Error deleting from S3:", err);
            }
        }

        await prisma.comment.deleteMany({
            where: { post_id: Number(postid) },
        });

        await prisma.notification.deleteMany({
            where: { post_id: Number(postid) },
        });

        await prisma.genrespost.deleteMany({
            where: { post_id: Number(postid) },
        });

        await prisma.posts.delete({
            where: { id: Number(postid) },
        });

    } catch (err) {
        console.error("Error deleting post:", err);
    }

    redirect("/admin");
}
