'use server'
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
const prisma = new PrismaClient();
export default async function deletepost(formData){
    const postid = formData.get("postid")
    try {
        await prisma.comment.deleteMany({
            where: { post_id: Number(postid) }
        })
        await prisma.notification.deleteMany({
            where: { post_id: Number(postid) }
        })
        await prisma.genrespost.deleteMany({
            where: { post_id: Number(postid) }
        })
        await prisma.posts.delete({
            where : {
                id : Number(postid)
            }
        })
    }catch(err){
        console.log("Error : ", err)
    }
    redirect("/admin/managepost")
}