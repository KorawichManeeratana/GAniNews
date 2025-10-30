import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "mock_secret";

/**
 * ฟังก์ชันสร้าง Access Token ใหม่ (จำลอง)
 */
function generateNewAccessToken(userId) {
  return jwt.sign({ user_id: userId }, SECRET, { expiresIn: "1h" });
}

export async function POST(req) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return new Response(
        JSON.stringify({ error: "missing_refresh_token" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let payload;
    try {
      payload = jwt.verify(refreshToken, SECRET);
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "invalid_or_expired_refresh_token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const newAccessToken = generateNewAccessToken(payload.user_id);

    return new Response(
      JSON.stringify({ access_token: newAccessToken }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Error refreshing token:", err);
    return new Response(
      JSON.stringify({ error: "internal_server_error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
