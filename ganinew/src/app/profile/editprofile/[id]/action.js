'use server';
import { jwtVerify, createRemoteJWKSet } from "jose";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const region = process.env.AWS_REGION;
const userPoolId = process.env.AWS_USER_POOL_ID;
const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
const JWKS = createRemoteJWKSet(new URL(jwksUrl));

export default async function updateProfile(formData) {
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

    // ตรวจสอบ token_use
    if (payload.token_use !== "id") {
        return NextResponse.json({ message: "Invalid token use" }, { status: 401 });
    }
    const user_id = payload.sub; // ในโปรเจกต์จริงควรดึงจาก session หรือ token

    const name = formData.get("name");
    const email = formData.get("email");
    const location = formData.get("location");
    const bio = formData.get("bio");
    const genresform = formData.get("genres");
    const file = formData.get("file"); // 🟣 ไฟล์ใหม่จาก form
    console.log("payload ::::", payload)
    console.log("file::::", file)
    let insertdata;
    let genres = [];

    try {
        genres = JSON.parse(genresform || "[]");
    } catch {
        genres = [];
    }

    // สร้าง object ของข้อมูลที่อัปเดต
    const checkdata = Object.fromEntries(
        Object.entries({ name, location, bio }).filter(([_, v]) => v)
    );

    try {
        // 🔹 ดึงข้อมูล userInfo เดิมเพื่อตรวจสอบรูปเก่า
        const oldInfo = await prisma.users.findUnique({
            where: { cognitoSub: user_id },
            include: {
                userinfo: true,
            }
        });

        let oldImageUrl = oldInfo?.userinfo.photo || null;
        let fileUrl = oldImageUrl;

        // 🔹 ถ้ามีไฟล์ใหม่ → ลบไฟล์เก่าออกจาก S3
        if (file && file.size > 0 && file.name !== "undefined" && oldImageUrl) {
            const h = await headers();
            const host = h.get("host");
            const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
            const baseUrl = `${protocol}://${host}`;

            try {
                const res = await fetch(`${baseUrl}/api/s3-delete`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ imageUrl: oldImageUrl }),
                });
                if (!res.ok) throw new Error("Delete failed");
            } catch (err) {
                console.error("S3 delete error:", err);
            }
        }

        // 🔹 ถ้ามีไฟล์ใหม่ → อัปโหลดขึ้น S3
        if (file && file.size > 0 && file.name !== "undefined") {
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
                checkdata.photo = fileUrl;
            } catch (err) {
                console.error("S3 upload error:", err);
                return NextResponse.json({ error: "File upload failed" }, { status: 400 });
            }
        } else {
            console.log("File is empty or undefined, skipping S3 upload");
        }


        // 🔹 อัปเดต email ใน users
        if (email) {
            await prisma.users.update({
                where: { cognitoSub: user_id },
                data: { email },
            });
        }

        // 🔹 อัปเดตหรือสร้าง userInfo
        const userInfoExists = await prisma.users.findUnique({
            where: { cognitoSub: user_id },
            include: {
                userinfo: true,
            }
        });
        console.log("userInfoExists ::::", userInfoExists.id)


        if (!userInfoExists) {
            insertdata = await prisma.userInfo.create({
                data: { ...checkdata, user_id: userInfoExists.id, photo: fileUrl },
                select: { id: true },
            });
        } else {
            insertdata = await prisma.userInfo.update({
                where: { user_id: userInfoExists.id },
                data: { ...checkdata, photo: fileUrl },
                select: { id: true },
            });
        }

        // 🔹 อัปเดต genres
        await prisma.userGen.deleteMany({ where: { userinfo_id: insertdata.id } });
        if (genres.length > 0) {
            await Promise.all(
                genres.map((genid) =>
                    prisma.userGen.create({
                        data: { gen_id: Number(genid), userinfo_id: insertdata.id },
                    })
                )
            );
        }

        redirect(`/profile/${userInfoExists.id}`);
    } catch (err) {
        if (err.digest?.startsWith("NEXT_REDIRECT")) throw err;
        console.error("Update profile error:", err);
        throw new Error("Something went wrong!");
    }
}
