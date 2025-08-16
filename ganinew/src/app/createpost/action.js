'use server'
import pool from "@/lib/db";
import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient()
export default async function createPost(formData) {
    const title = formData.get('title')
    const category = formData.get('category')
    const content = formData.get('content')
    try {
        const insertdata = await prisma.Posts.create({
            data: {
                title : title,
                body : content,
                category : category,
                user_id : 1
            }
        })
        console.log("Insert success:", insertdata);
        return insertdata;
    } catch (err) {
        console.error('DB connection error:', err)
        return (<div>Connot connect</div>)
    }
}
