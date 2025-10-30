import crypto from "crypto";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const SALT_ROUNDS = 10; // จำนวนรอบสำหรับ hash

export async function POST(req) {
  try {
    const { username, email, password, confirmPassword } = await req.json();

    if (!email || !password || !confirmPassword || !username) {
      return NextResponse.json({ message: "User Data required." }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match." }, { status: 400 });
    }

    // Normalize email และ username
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // สร้าง Mock sub เอง
    const sub = crypto.randomUUID();

    const user = await prisma.users.create({
      data: {
        cognitoSub: sub,
        username: normalizedUsername,
        email: normalizedEmail,
        password: hashedPassword,
        role: "user",
        userinfo: {
          create: {
            name: normalizedUsername,
            photo: "https://i.pinimg.com/1200x/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg",
            bio: null,
            location: null,
          },
        },
      },
    });

    return NextResponse.json({
      message: "User registered successfully",
      userSub: sub,
      userConfirmed: true,
    }, { status: 200 });

  } catch (error) {
    console.error(error);

    // เช็ค error ของ unique constraint
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    return NextResponse.json({
      message: error.message || "Error registering user"
    }, { status: 400 });
  }
}
