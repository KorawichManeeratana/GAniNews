import { PrismaClient } from "@/generated/prisma"
import { NextResponse } from "next/server"
const prisma = new PrismaClient()
export async function GET(){
    const data = await prisma.Genres.findMany()
    return NextResponse.json(data)
}