import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
export async function GET() {
  try {
    const data = await prisma.reports.findMany()
    return NextResponse.json(data)
  } catch (err) {
    console.log("GET Error:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
export async function POST(req) {
  try {
    // รับค่าจาก body
    const { subject, from_user, post_id, detail } = await req.json();

    // สร้าง record ใหม่
    const data = await prisma.reports.create({
      data: {
        subject,
        from_user,
        post_id,
        detail,
        status: "pending", // กำหนด default
        create_at: new Date(), // เวลา ณ ปัจจุบัน
      },
    });

    return NextResponse.json({ success: true, report: data });
  } catch (err) {
    console.log("POST Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
