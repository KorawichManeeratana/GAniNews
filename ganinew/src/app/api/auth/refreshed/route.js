const COGNITO_DOMAIN = process.env.COGNITO_DOMAIN;
const CLIENT_ID = process.env.AWS_APP_CLIENT_ID;
export async function POST(req) {
  const { refreshToken } = await req.json();
  console.log("Refresh Token:", refreshToken);

  if (!refreshToken) {
    return Response.json({ error: "missing_refresh_token" }, { status: 400 });
  }

  const res = await fetch(`https://${COGNITO_DOMAIN}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: CLIENT_ID,
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) return Response.json({ error: "failed" }, { status: 401 });

  const data = await res.json();

  return Response.json({ access_token: data.access_token });
}