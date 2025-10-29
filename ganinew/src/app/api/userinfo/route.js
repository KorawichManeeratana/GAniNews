import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify, createRemoteJWKSet } from "jose";

const region = process.env.AWS_REGION;
const userPoolId = process.env.AWS_USER_POOL_ID;
const clientId = process.env.AWS_APP_CLIENT_ID;
const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
const JWKS = createRemoteJWKSet(new URL(jwksUrl));

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // ดึง token จาก cookie
    const cookieStore = req.cookies;
    const idToken = cookieStore.get("id_token")?.value;

    if (!idToken) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    let currentUserSub;
    try {
        const { payload } = await jwtVerify(idToken, JWKS, {
            issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
            audience: clientId,
        });

        if (payload.token_use !== "id") {
            return NextResponse.json({ message: "Invalid token use" }, { status: 401 });
        }

        currentUserSub = payload.sub; // Cognito sub ของผู้เรียก
    } catch (err) {
        return NextResponse.json({ message: "Invalid token", error: err.message }, { status: 401 });
    }

    const userinfo = await prisma.userInfo.findUnique({
            where: {
                user_id: parseInt(id)
            },
            include: {
                user: {
                    include: {
                        bookmark: {
                            include: {
                                post: true
                            }
                        }
                    }
                },
                usergen: {
                    include: {
                        genre: true
                    }
                }
            }
        })



        if (!userinfo) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // ตรวจสอบว่าเจ้าของ profile ตรงกับ token หรือไม่
        const isOwner = userinfo.user.cognitoSub === currentUserSub;

        return NextResponse.json({ userinfo, isOwner });
        


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
