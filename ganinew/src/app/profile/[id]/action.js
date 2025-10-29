'use server'
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"
const prisma = new PrismaClient()
export async function deletebookmark(formData) {
    const bookmark_id = formData.get("bookmark_id")
    try {
        await prisma.bookmark.delete({
            where: { id: Number(bookmark_id) }
        })
    } catch (err) {
        console.log("Error : ", err)
    }
    redirect("/profile")
}