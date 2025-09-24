import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET(request) {
  const postdata = await prisma.comment.findMany();
  return NextResponse.json(postdata);
}
