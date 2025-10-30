"use client";
import { Header } from "/src/components/header";
import { useEffect, useState } from "react";
import Editors from "@/components/editor";
import ImageUpload from "@/components/upload";
import Link from "next/link";
import createPost from "./action";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";

export const createpost = () => {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [genresdata, setGenresdata] = useState([]);
  const [selectgen, setSelectgen] = useState([]);
  const [thumbnail, setThumbnail] = useState("");
  const [isAdmin, setIsAdmin] = useState(null);
  

  const togglegen = (genre) => {
    if (selectgen.includes(genre)) {
      setSelectgen((prevItems) => prevItems.filter((item) => item !== genre));
    } else {
      setSelectgen((prevItems) => [...prevItems, genre]);
    }
  };
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch("/api/genres");
        const data = await res.json();
        setGenresdata(data);
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

    if (isAdmin === null) return (<div> <Loading/> </div>);

  return (
    <div>
      {isAdmin ? (
        <>
          <div className="flex justify-center mb-6">
            <Link
              href="/admin"
              className="inline-block min-w-[200px] text-center rounded-md px-4 py-2 font-semibold hover:bg-purple-500 hover:text-white transition"
            >
              ← Back to Admin Page
            </Link>
          </div>

          <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 space-y-6">
            <h1 className="text-2xl font-bold text-purple-500">
              Create a New Post
            </h1>
            <form action={createPost} className="flex flex-col space-y-4">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  name="title"
                  id="title"
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Enter post title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <input
                  name="description"
                  id="description"
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Enter post description"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option>Game</option>
                  <option>Anime</option>
                </select>
              </div>

              {/* Post Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Content
                </label>
                <Editors value={content} onChange={setContent} />
                <input type="hidden" name="content" value={content} />
              </div>

              {/* Genres */}
              <div>
                <label
                  htmlFor="genres"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Genres
                </label>
                <div className="flex flex-wrap gap-2">
                  {genresdata.map((genre) => (
                    <button
                      key={genre.id}
                      type="button"
                      onClick={() => togglegen(genre)}
                      className={`px-4 py-1 rounded-full transition ${
                        selectgen.find((g) => g.id === genre.id)
                          ? "bg-purple-500 text-white"
                          : "bg-gray-100 hover:bg-purple-500 hover:text-white"
                      }`}
                    >
                      {genre.gen_name}
                    </button>
                  ))}
                  <input
                    type="hidden"
                    name="genres"
                    value={JSON.stringify(selectgen.map((g) => g.id))}
                  />
                </div>
              </div>

              {/* Thumbnail */}
              <div className="min-h-[350px]">
                <label
                  htmlFor="thumbnail"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Thumbnail Image
                </label>
                <ImageUpload onUpload={(link) => setThumbnail(link)} required />
                <input type="hidden" name="image" value={thumbnail || ""} />
              </div>

              {/* Submit Button */}
              <div className="flex flex-col items-center">
                <button
                  type="submit"
                  className="mt-6 w-full bg-purple-500 text-white py-2 px-4 rounded-md shadow hover:bg-purple-400 transition cursor-pointer"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <div className="text-center mt-10 text-red-500 font-bold text-2xl">
          Access Denied. You are not admin user.
        </div>
      )}
    </div>
  );
};

export default createpost;
