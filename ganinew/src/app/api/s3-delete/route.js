import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: "ASIAYS2NRVSTLJLRMJJ2",
        secretAccessKey: "N8QEL+Tti1ZCbneKlWLpWjd4MgNxchVQXNh6Z59F",
        sessionToken:"IQoJb3JpZ2luX2VjEBcaCXVzLXdlc3QtMiJHMEUCIQDdtZo6WgH47vd5JfKUwBXzVqFiCRzfJ8OlVCMBlqHOdgIgP1vLX4fDMjklVprtU82aPI9H4VJnn65QJKv1M0oEhMoqtwII0P//////////ARAAGgw1OTAxODM3NzEzMDIiDKKeKjf/yW6eTQQp3CqLAk6QVR0TGNQTUTrLI56NreEps9YVKTGPMA70yh6hzTnLr6q9Gpl/cXYHC+4UU7bT/y+zvVbI2D9qr9gdR8lTLkcJPLD0Ovoww6wGkokDBt9YjLGbbPfca0kYskCuJMtDCMGxKqIjn/EbAHfHbkhw3yXm1OxsV+N2XCxPJGAD9hXC2PwnO3JJd2k/N3NVrqyu0eWmR4Dadlen5U4+ZyVuFdGr45o7oE1giM8Myx1VplPlqepOGt5JY+mf8Eb7m+Sz6xRB/QkGwY+RKVe7LdLvQjtPO0CT3hh95nnALVG0YtPpgHaQeQIygZAjCAQdxQgYTG/NQkc/1NDMgX1t81GhsNXI5sIlEkx5kbNeijD85obIBjqdAYxylALN8TRZBIEu1NJowMe1UE16PMYrHMCq2MhiaAZ54kbDmodMQIgxu1+PUilNH1Cp+Q0Oqy+liE4nRR4ZTNIrts75rRvcmR/FDuxij4VR0lXCIvgjiAiDQuHVVkjqptuCL7LaO7GkR4iakKNQQ/tDCNvuZjkLuRs+13V420NZWMUFbxvHIYpYzbg81AZQbD4Xf5JsGWadaIspgpY="
    }
})

export async function POST(req) {
    try {
        const { imageUrl } = await req.json();
        if (!imageUrl) {
            return NextResponse.json({ error: "Missing imageUrl" }, { status: 400 });
        }

        // แยกชื่อไฟล์ออกจาก URL
        const fileName = imageUrl.split('/').pop();
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
