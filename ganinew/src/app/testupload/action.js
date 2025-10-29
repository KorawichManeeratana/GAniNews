"use server"
import { headers } from "next/headers";

export async function testdata(formData) {
  const title = formData.get("title");
  
  const file = formData.get("file"); 

  const uploadForm = new FormData();
  uploadForm.append("file", file);
  console.log(uploadForm)
  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/s3-upload`, {
    method: "POST",
    body: uploadForm,
  });

  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();

  return { title, imageLink: data.link };
}
