'use server'
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
const prisma = new PrismaClient()
export default async function createPost(formData) {
    const title = formData.get('title')
    const category = formData.get('category')
    const content = formData.get('content')
    const genresform = formData.get('genres')
    const description = formData.get('description')
    const images = formData.get('image')
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
                user_id: 1,
                description : description,
                image : images
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
