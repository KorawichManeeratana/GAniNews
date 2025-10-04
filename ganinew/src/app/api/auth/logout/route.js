import { NextResponse } from "next/server";

export async function POST() {
  try {
    // ลบ cookies ทั้งหมดที่เกี่ยวกับ auth
    const response = NextResponse.json({ status: "OK", message: "Logged out" });

    response.cookies.set("id_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "lax",
      path: "/",
      expires: new Date(0), // หมดอายุทันที
    });

    response.cookies.set("refresh_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json(
      { status: "ERROR", message: "Logout failed" },
      { status: 500 }
    );
  }
}
