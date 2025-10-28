import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify, createRemoteJWKSet } from "jose";

export async function GET(req){
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    console.log(id)
    const userinfo = await prisma.userInfo.findMany({
        where :{
            user_id : parseInt(id)
        },
        include: {
            user:{
                include:{
                    bookmark : {
                        include :{
                            post:true
                        }
                    }
                }
            },
            usergen :{
                include :{
                    genre:true
                }
            } 
        }
    })
    return NextResponse.json(userinfo)
}
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
