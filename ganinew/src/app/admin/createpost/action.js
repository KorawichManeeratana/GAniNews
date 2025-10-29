"use server";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { jwtVerify, createRemoteJWKSet } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
const prisma = new PrismaClient();
const region = process.env.AWS_REGION;
const userPoolId = process.env.AWS_USER_POOL_ID;
const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
const JWKS = createRemoteJWKSet(new URL(jwksUrl));


export default async function createPost(formData) {
  const cookieStore = await require("next/headers").cookies();
  const idTokenCookie = cookieStore.get("id_token");
  const idToken = idTokenCookie?.value;

  if (!idToken) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { payload } = await jwtVerify(idToken, JWKS, {
    issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
    audience: process.env.AWS_APP_CLIENT_ID,
  });

  if (payload.token_use !== "id") {
    return NextResponse.json({ message: "Invalid token use" }, { status: 401 });
  }

  const title = formData.get("title");
  const category = formData.get("category");
  const content = formData.get("content");
  const genresform = formData.get("genres");
  const description = formData.get("description");
  const images = formData.get("image");
  let genres = [];
  const file = formData.get("file"); 
    let fileUrl = null;

    if (file) {
        const uploadForm = new FormData();
        uploadForm.append("file", file);

        const h = await headers();
        const host = h.get("host");
        const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
        const baseUrl = `${protocol}://${host}`;

        try {
            const res = await fetch(`${baseUrl}/api/s3-upload`, {
                method: "POST",
                body: uploadForm,
            });

            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            fileUrl = data.url;
        } catch (err) {
            console.error("Upload error:", err);
            return NextResponse.json({ error: 'File upload failed' }, { status: 400 })
        }
    }

    genres = genresform ? JSON.parse(genresform) : [];


    try {
        const insertdata = await prisma.Posts.create({
            data: {
                title: title,
                body: content,
                category: category,
                description : description,
                image : fileUrl,
                user: {
                    connect: { id: 1 } 
                    }
                },
            select: {
                id: true
            }
        })

        if (genres.length > 0) {
            await Promise.all(
                genres.map(genid =>
                    prisma.genrespost.create({
                        data: {
                            gen_id: Number(genid),
                            post_id: insertdata.id
                        }
                    })
                )
            )
        }

        await prisma.notification.create({
            data:{
                title : title,
                content : description,
                url_post : `/newsDetail/${insertdata.id}`,
                post_id: insertdata.id
            }
        })
        redirect("/admin")
    } catch (err) {
        if (err.digest?.startsWith("NEXT_REDIRECT")) {
            throw err;
        }
        console.error(err);
        throw new Error("Someting Wrong!");
    }

}
