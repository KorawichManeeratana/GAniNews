import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid'
import { content } from "../../../../tailwind.config.mjs";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN, // optional
  },
});

export async function POST(req) {
    try {
        const formData = await req.formData()
        const file = formData.get("file")
        if (!file) {
            return NextResponse.json({ error: 'No file' }, { status: 400 })
        }
        const buffer = Buffer.from(await file.arrayBuffer())
        const fileName = uuidv4() + '-' + file.name.replace(/\s+/g, '_')
        const bucket = "ganinews-s3bucket"
        const params = {
            Bucket: bucket,
            Key: fileName,
            Body: buffer,
            ContentType: file.type,
        }
        console.log("param  : ", params)
        const command = new PutObjectCommand(params)


        await s3.send(command)
        const fileUrl = `https://${bucket}.s3.us-east-1.amazonaws.com/${fileName}`
        return NextResponse.json({ url: fileUrl });
    } catch (err) {
        console.error("Upload error:", err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

}