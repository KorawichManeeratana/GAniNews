import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Secret สำหรับ sign JWT ของเราเอง
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRE = 60 * 60; // 1 ชั่วโมง

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: "Missing email/password" }, { status: 400 });
    }

    // Normalize email ก่อนค้นหา
    const normalizedEmail = email.trim().toLowerCase();

    // หา user ใน DB
    const user = await prisma.users.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ตรวจสอบ password hash
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    // สร้าง JWT token ของเราเอง
    const payload = { sub: user.cognitoSub, email: user.email };
    const idToken = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRE });
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRE });
    const refreshToken = crypto.randomUUID(); // Mock refresh token

    const res = NextResponse.json(
      { status: "OK", user: { sub: user.cognitoSub, email: user.email } },
      { status: 200 }
    );

    const isProd = process.env.NODE_ENV === "production";

    res.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/api",
      maxAge: 60 * 60 * 24 * 30, // 30 วัน
    });

    res.cookies.set("id_token", idToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: TOKEN_EXPIRE,
    });

    res.cookies.set("access_token", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: TOKEN_EXPIRE,
    });

    return res;

  } catch (err) {
    console.error("Mock login error:", err);
    return NextResponse.json(
      { message: err?.message || "Login failed", status: "ERROR" },
      { status: 400 }
    );
  }
}
