'use server'
import pool from "@/lib/db";

export default async function addPost(formData) {
    const title = formData.get('title')
    const category = formData.get('category')
    const content = formData.get('content')
    try {
        const client = await pool.connect()
        console.log("db connected")
        await client.query(
        'INSERT INTO posts (title, body, created_at, category) VALUES ($1, $2,NOW(), $3)',
        [title, content, category]
        ) 
        client.release()
    } catch (err) {
        console.error('DB connection error:', err)
        return (<div>Connot connect</div>)
    }
}
