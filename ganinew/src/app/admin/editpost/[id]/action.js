'use server'
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
const prisma = new PrismaClient()
export default async function updatePost(formData) {
    const postId = Number(formData.get('postid'));
    const title = formData.get('title')
    const category = formData.get('category')
    const content = formData.get('content')
    const genresform = formData.get('genres')
    const description = formData.get('description')
    const images = formData.get('image')
    let rawgenres = [];
    try {
        rawgenres = JSON.parse(genresform);
    } catch {
        rawgenres = [];
    }
    let genres = [...new Set(rawgenres)]
    try {
        await prisma.Posts.update({
            where : {
                id:postId
            },
            data: {
                title: title,
                body: content,
                category: category,
                description : description,
                image : images
            },
            select: {
                id: true
            }

        })
        await prisma.genrespost.deleteMany({
            where: { post_id: postId }
        })

        if (genres.length > 0) {
            await Promise.all(
                genres.map(genid =>
                    prisma.genrespost.create({
                        data: {
                            gen_id: Number(genid),
                            post_id: postId
                        }
                    })
                )
            )
        }
        redirect("/admin/managepost")
    } catch (err) {
        if (err.digest?.startsWith("NEXT_REDIRECT")) {
            throw err;
        }
        console.error(err);
        throw new Error("Someting Wrong!");
    }

}
