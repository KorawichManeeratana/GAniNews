// app/api/auth/me/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    // อ่าน cookie server-side
    const cookieStore = await require("next/headers").cookies();
    const idTokenCookie = cookieStore.get("id_token");
    const idToken = idTokenCookie?.value;

    if (!idToken) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    // Verify JWT ของเราเอง
    let payload;
    try {
      payload = jwt.verify(idToken, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const sub = payload.sub;
    if (!sub) return NextResponse.json({ message: "Invalid token payload" }, { status: 401 });

    // ดึง user จาก DB
    const user = await prisma.users.findUnique({
      where: { cognitoSub: sub },
      include: { userinfo: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const safeUser = {
      id: user.id,
      role: user.role,
      user_info: user.userinfo,
    };

    return NextResponse.json({ ok: true, user: safeUser }, { status: 200 });

  } catch (err) {
    console.error("auth/me error:", err);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
