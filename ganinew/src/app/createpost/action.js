'use server'
import { PrismaClient } from "@/generated/prisma";
import { redirect } from "next/navigation";
const prisma = new PrismaClient()
export default async function createPost(formData) {
    const title = formData.get('title')
    const category = formData.get('category')
    const content = formData.get('content')
    const genresform = formData.get('genres');
    let genres = [];
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
                user_id: 1
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
        console.log("Insert success:", insertdata);
        redirect("/")
    } catch (err) {
        if (err.digest?.startsWith("NEXT_REDIRECT")) {
            throw err;
        }
        console.error("DB connection error:", err);
        throw new Error("Cannot connect");
    }

}
