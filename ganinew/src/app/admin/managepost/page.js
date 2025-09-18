'use client'
import Script from "next/script";
import { useEffect, useState } from "react";
import { Scripts } from "react-router-dom";
import Link from "next/link";
import deletepost from "./action";
export default function ManagePage() {
  const [news, setNews] = useState([])
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch('/api/news')
        const data = await res.json()
        setNews(data)
      } catch (err) {
        console.log("Error is : ", err)
      }
    }
    fetchdata()
  }, [])
  return (
    <div className="p-6">
      <table className="table-auto border-collapse border border-gray-300 w-full shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-gray-700 text-left">
            <th className="border border-gray-300 px-6 py-3 text-center">ID</th>
            <th className="border border-gray-300 px-6 py-3 text-center">Image</th>
            <th className="border border-gray-300 px-6 py-3 text-center">Title</th>
            <th className="border border-gray-300 px-6 py-3 text-center">CreateAt</th>
            <th className="border border-gray-300 px-6 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {
            news.map((post, index) => (


              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-center text-gray-800">{post.id}</td>
                <td className="px-6 py-4 text-center">
                  {post.image ? (
                    <img
                      className="mx-auto w-40 h-28 object-cover rounded-lg shadow-sm"
                      src={post.image}
                      alt="IMAGE"
                    />
                  ) : (
                    <img
                      className="mx-auto w-40 h-28 object-cover rounded-lg shadow-sm"
                      src='https://static.vecteezy.com/system/resources/previews/022/059/000/non_2x/no-image-available-icon-vector.jpg'
                      alt="IMAGE"
                    />
                  )}
                </td>
                <td className="px-6 py-4 font-medium  text-gray-700">{post.title}</td>
                <td className="px-6 py-4 text-gray-800">{post.created_at}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-3">
                    <Link href={`/newsDetail/${post.id}`} className="inline-block min-w-[80px] min-h-[30px] text-center rounded-md px-4 py-2 bg-green-400 hover:bg-green-500 hover:text-white transition">View Post</Link>
                    <Link href={`/admin/editpost/${post.id}`} className="inline-block min-w-[80px] min-h-[30px] text-center rounded-md px-4 py-2 bg-amber-400 hover:bg-amber-500 hover:text-white transition">Edit</Link>
                    <form action={deletepost}>
                      <input type="hidden" name="postid" value={post.id} />
                      <button className="inline-block min-w-[80px] min-h-[30px] text-center rounded-md px-4 py-2 bg-red-500 hover:bg-red-600 hover:text-white transition">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}