"use client";
import { useState, useEffect } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { Pen } from 'lucide-react'
import Link from 'next/link'
import { deletebookmark } from './action'
export default function profile({ params }) {
  const [isOwner, setIsOwner] = useState(false);
  const [userinfo, setUserinfo] = useState([]);
  const [user, setUser] = useState([]);
  const [gendata, setGenresdata] = useState([]);
  const id = React.use(params);
  const router = useRouter();
  const [expand, setExpand] = useState(false)
  useEffect(() => {
    if (!id) return;

    const fetchdata = async () => {
      try {
        const apiuserinfo = await fetch(`/api/userinfo?id=${id.id}`);
        const datauserinfo = await apiuserinfo.json();
        console.log("datauserinfo ----> ", datauserinfo.isOwner)
        setUserinfo([datauserinfo.userinfo]);
        setIsOwner(datauserinfo.isOwner);
      } catch (err) {
        console.log("Error is : ", err);
      }
    };
    fetchdata();
  }, []);

  const handleBackToHome = () => {
    router.push("/");
  };
  const expandedit = () => {
        if (expand) {
            setExpand(false)
        } else {
            setExpand(true)
        }
    }
  
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center py-8">
      <div className="w-full max-w-5xl mb-6 px-4 cursor-pointer">
        <span
          onClick={handleBackToHome}
          className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1"
        >
          ← Back to Home
        </span>
      </div>

      {userinfo.map((i, index) => (
        <div
          key={index}
          className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 px-4"
        >
          <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <img
                className="w-52 h-26 mt-2 rounded-full shadow-md object-cover"
                src={
                  i.photo
                    ? `${i.photo}`
                    : "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                }
              ></img>
            </div>

            {i.name ? (
              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                {i.name}
              </h2>
            ) : (
              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                {i.user.username}
              </h2>
            )}

           {isOwner &&( <a 
              href={`/profile/editprofile/${i.user_id}`}
              className="mt-2 px-4 py-2 bg-white border rounded-lg flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              ✎ Edit Profile
            </a>
            )}
            <div className="mt-6 w-full text-sm text-gray-600 space-y-3">
              <p className="flex items-center gap-2">
                📧 <span>{i.user.email}</span>
              </p>
              <p className="flex items-center gap-2">
                📍 <span>{i.location}</span>
              </p>
              <p className="flex items-center gap-2">
                📅{" "}
                <span>
                  {new Date(i.user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            </div>

            <div className="my-4 border-t w-full"></div>

            <div className="w-full">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Favorite Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {i.usergen.map((j) => (
                  <span
                    key={j.gen_id}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {j.genre.gen_name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6 md:col-span-2">
            <h3 className="text-base font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-normal break-words">
              {i.bio}
            </p>
            <div className='flex items-center gap-2'>
              <h3 className='text-base font-semibold text-gray-900'>My Book Mark</h3>
              { isOwner && (<a
                onClick={expandedit}
                className="ml-auto flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg hover:shadow-xl transition transform hover:scale-110 cursor-pointer select-none"
              >
                <Pen className="w-4 h-4" />
              </a>)}
            </div>


            <div className='flex flex-nowrap gap-5 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 py-2'>
              {i.user.bookmark.length > 0 ? (
                i.user.bookmark.map((j, inx) => (
                  <div
                    key={inx}
                    className="bg-white shadow-lg hover:shadow-xl transition rounded-xl flex-shrink-0 min-w-[230px] max-w-[250px] overflow-hidden border border-gray-200"
                  >
                    <img
                      className="rounded-3xl h-70 w-full object-cover p-2"
                      src={j.post.image ? `${j.post.image}` : "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"}
                    />
                    <h2 className="text-base font-semibold mt-1 break-words truncate p-2">{j.post.title}</h2>

                    {expand ? (
                      <div className="flex justify-center gap-2">
                        <form action={deletebookmark}>
                          <input type="hidden" name="bookmark_id" value={j.id} />
                          <button
                            className="w-full py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 
                                    text-white font-medium shadow-md hover:shadow-lg 
                                    transition-transform transform hover:scale-105 cursor-pointer p-2"
                          >
                            Remove
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div>
                        <Link
                          href={`/newsDetail/${j.post.id}`}
                          className="w-full inline-block text-center py-2 
                                bg-gradient-to-r from-violet-500 to-indigo-500 
                                text-white font-medium shadow-md hover:shadow-lg 
                                transition-transform transform hover:scale-105 cursor-pointer"
                        >
                          View News
                        </Link>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center w-full text-gray-500 italic mt-6">
                  Add your favorite news
                </div>
              )}
            </div>


          </div>
        </div>
      ))}
    </div>
  );
}
