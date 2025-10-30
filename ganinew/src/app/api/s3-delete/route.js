import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

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
    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: "Missing imageUrl" }, { status: 400 });
    }

    // แยกชื่อไฟล์ออกจาก URL
    const fileName = imageUrl.split("/").pop();
    const bucket = "ganinews-s3bucket";

    const params = {
      Bucket: bucket,
      Key: fileName,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    return NextResponse.json({ success: true, message: `Deleted ${fileName}` });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
