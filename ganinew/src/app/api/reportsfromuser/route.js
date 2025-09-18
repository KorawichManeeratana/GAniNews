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

