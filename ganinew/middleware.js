import { NextResponse } from "next/server";

// ตั้งค่า environment
const isProd = process.env.NODE_ENV;

export async function middleware(req) {
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  // ถ้าไม่มี token เลย → กลับไป login
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // ✅ decode JWT เอง (ไม่ต้อง verify กับ Cognito)
    const payload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64").toString());
    const now = Math.floor(Date.now() / 1000);

    // ถ้า token หมดอายุ → ลอง refresh
    if (payload.exp && payload.exp < now) {
      if (!refreshToken) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // ขอ token ใหม่จาก API refresh
      const refreshResponse = await fetch(`${req.nextUrl.origin}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshResponse.ok) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      const { access_token: newAccessToken } = await refreshResponse.json();

      // อัปเดต cookie ใหม่
      const response = NextResponse.next();
      response.cookies.set("access_token", newAccessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60, // 1 ชั่วโมง
      });

      return response;
    }

    // ✅ token ยังไม่หมดอายุ → ผ่านได้เลย
    return NextResponse.next();
  } catch (err) {
    console.error("Invalid access token:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// ✅ ตั้ง path ที่ middleware จะทำงาน
export const config = {
  matcher: [
    "/((?!login|register|public|_next/static|_next/image|favicon.ico).*)",
  ],
};