import fs from 'fs';
import path from 'path';

export async function POST(req) {
    try {
        const body = await req.json();
        const { link } = body;
        if (!link) {
            return new Response(JSON.stringify({ error: 'No file link provided' }), { status: 400 });
        }
        const filePath = path.join(process.cwd(), 'public', link.replace(/^\/+/, ''));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return new Response(JSON.stringify({ message: 'File deleted successfully' }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: 'File not found' }), { status: 404 });
        }
    } catch (err) {
        console.error("Delete error:", err);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
