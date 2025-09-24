import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
export async function GET(){
    const userinfo = await prisma.userInfo.findMany({
        where :{
            user_id : 1
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
