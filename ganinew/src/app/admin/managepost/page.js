"use client";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import deletepost from "./action";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

export default function ManagePage() {
  const [news, setNews] = useState([]);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch("/api/news/getAllNews");
        const data = await res.json();
        setNews(data);
      } catch (err) {
        console.log("Error is : ", err);
      }
    };
    fetchdata();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/checkAdminUser");
        if (res.status === 403) router.push("/");

        if (res.ok) {
          setIsAdmin(true);
        }
      } catch (err) {
        console.log("Error is:", err);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
      e.preventDefault(); // ป้องกัน reload page
  
      setLoading(true);
  
      const formData = new FormData(e.target); // ตอนนี้ formData มีค่าจริง
      // ส่งไป server action
      try {
        await createProfile(formData);
        router.push("/homepage");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);

    const diffMs = now - past; // ต่างกันเป็น milliseconds
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return `${diffSec} วินาทีที่แล้ว`;
    if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
    if (diffHour < 24) return `${diffHour} ชั่วโมงที่แล้ว`;
    return `${diffDay} วันที่แล้ว`;
  }

  if (isAdmin === null) return (<div> <Loading/> </div>);

  return (
    <div className="p-6">
      {isPending && <Loading />}
      {isAdmin ? (
        <table className="table-auto border-collapse border border-gray-300 w-full shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="border border-gray-300 px-6 py-3 text-center">
                ID
              </th>
              <th className="border border-gray-300 px-6 py-3 text-center">
                Image
              </th>
              <th className="border border-gray-300 px-6 py-3 text-center">
                Title
              </th>
              <th className="border border-gray-300 px-6 py-3 text-center">
                CreateAt
              </th>
              <th className="border border-gray-300 px-6 py-3 text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {news.length > 0 ? (
              news.map((post, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-center text-gray-800">
                    {post.id}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <img
                      className="mx-auto w-40 h-28 object-cover rounded-lg shadow-sm"
                      src={
                        post.image ||
                        "https://static.vecteezy.com/system/resources/previews/022/059/000/non_2x/no-image-available-icon-vector.jpg"
                      }
                      alt="IMAGE"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {post.title}
                  </td>
                  <td className="px-6 py-4 text-gray-800">{timeAgo(post.created_at)}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <Link
                        href={`/newsDetail/${post.id}`}
                        className="inline-block min-w-[80px] rounded-md px-4 py-2 bg-green-400 hover:bg-green-500 hover:text-white transition"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/editpost/${post.id}`}
                        className="inline-block min-w-[80px] rounded-md px-4 py-2 bg-amber-400 hover:bg-amber-500 hover:text-white transition"
                      >
                        Edit
                      </Link>
                      <form action={(formData) => startTransition(() => deletepost(formData))}>
                        <input type="hidden" name="postid" value={post.id} />
                        <button className="inline-block min-w-[80px] rounded-md px-4 py-2 bg-red-500 hover:bg-red-600 hover:text-white transition">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No post data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <div className="text-center mt-10 text-red-500 font-bold text-2xl">
          Access Denied. You are not admin user.
        </div>
      )}
    </div>
  );
}
