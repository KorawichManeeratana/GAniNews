// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient()
// export async function GET(){
//     const postdata = await prisma.Posts.findMany()
//     return Response.json(postdata)
// }
// export async function POST(request){
//     const body = await request.json();
//     const { gen_name } = body;
//     const add = await prisma.Genres.create({
//         data : {
//             gen_name: gen_name
//         }
//     })
//     return Response.json(add)
// }
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
export async function GET(){
    const postdata = await prisma.Posts.findMany()
    return Response.json(postdata)
}
export async function POST(request){
    const body = await request.json();
    const { gen_name } = body;
    const add = await prisma.Genres.create({
        data : {
            gen_name: gen_name
        }
    })
    return Response.json(add)
}
