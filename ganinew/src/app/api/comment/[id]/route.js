import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const param_id = Number(params.id);
  const postdata = await prisma.comment.findMany({
    where: {
      post_id: param_id,
    },
    include:{
      user: {
        include:{
          userinfo:true
        }
      }
    }
  });

  return NextResponse.json(postdata);
}
