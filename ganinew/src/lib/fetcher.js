export async function fetcherWithCredentials(url) {
  const res = await fetch(url, {
    method: "GET",
    credentials: "include", // cookie
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = new Error("An error occurred while fetching the data.");
    try {
      err.info = await res.json();
    } catch { /* ไม่ทำไร */}
    err.status = res.status;
    throw err;
  }

  return res.json();
}