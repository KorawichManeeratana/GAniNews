"use client"
import { Header } from "/src/components/header";
import { useState, useEffect } from "react";
import Editors from "@/components/editor";
import ImageUpload from "@/components/upload";
import Link from "next/link";
import createProfile from "./action"
export default function Editprofile() {
  const [thumbnail, setThumbnail] = useState('')
  const [selectgen, setSelectgen] = useState([])
  const [genresdata, setGenresdata] = useState([])
  const [form, setForm] = useState({
    name : '',
    email : '',
    location : '',
    bio : ''
  })
  const togglegen = (genre) => {
    if (selectgen.includes(genre)) {
      setSelectgen(prevItems => prevItems.filter(item => item !== genre));
    }
    else {
      setSelectgen(prevItems => [...prevItems, genre]);
    }

  }
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch('/api/genres')
        const data = await res.json()
        setGenresdata(data)
      } catch (err) {
        console.log("Error is : ", err)
      }
    }
    const fetchuserdata = async () => {
      try {
        const res = await fetch('/api/userinfo')
        const data = await res.json()
        setThumbnail(data[0].photo)
        setForm({
          name: data[0].name || '',
          email: data[0].user.email || '',
          location: data[0].location || '',
          bio: data[0].bio || ''
        })
        console.log("thumnail : ", thumbnail)
      } catch (err) {
        console.log("Error is : ", err)
      }
    }
    fetchuserdata()
    fetchdata()


  }, [])
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-center mb-6">

        <Link href="/homepage" className="inline-block min-w-[200px] text-center rounded-md px-4 py-2 font-semibold hover:bg-purple-500 hover:text-white transition">← Back to HomePage</Link>

      </div>
      <div>
        <form action={createProfile} className="grid-flow-col space-y-4">
          <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 space-y-6">
            <h1 className="text-2xl font-bold text-purple-500">
              Edit Profile   </h1>
            <div className="flex justify-center">
              <img
                src={thumbnail ? thumbnail : "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"}
                alt="preview"
                className={`w-52 h-50 mt-2 rounded-full shadow-md object-cover ${thumbnail ? "" : "opacity-100"}`}
              />
            </div>
            <ImageUpload onUpload={(link) => setThumbnail(link)} />
            <input
              type="hidden"
              name="image"
              value={thumbnail || ""}
            />
          </div>
          <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name 
            </label>
            <input
              name="name"
              id="name"
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter your name..."
              defaultValue={form.name ? form.name : ""}
            />

            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              id="email"
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter your new email..."
              defaultValue={form.email ? form.email : ""}
            />

            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              name="location"
              id="location"
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter your location..."
              defaultValue={form.location ? form.location : ""}
            />

            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              rows={4}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Tell us about yourself..."
              defaultValue={form.bio ? form.bio : ""}
            />
            <br />
            <label htmlFor="favoritegen" className="block text-sm font-medium text-gray-700">
              Favorite Genres
            </label>
            <label htmlFor="favoritegen" className="block text-sm font-medium text-gray-500">
              Select your favorite game and anime genres
            </label>
            <div className="flex flex-wrap gap-2">
              {genresdata.map((genre) => (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => togglegen(genre)}
                  className={`px-4 py-1 rounded-full transition ${selectgen.find((g) => g.id === genre.id)
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 hover:bg-purple-500 hover:text-white'
                    }`}
                >
                  {genre.gen_name}
                </button>

              ))}
              <input
                type="hidden"
                name="genres"
                value={JSON.stringify(selectgen.map(g => g.id))}
              />
            </div>
            <button
              type="submit"
              className="mt-6 w-full bg-purple-500 text-white py-2 px-4 rounded-md shadow hover:bg-purple-400 transition"
            >
              Save Changes
            </button>
          </div>
          <div>

          </div>
        </form>
      </div>
    </div>
  );
}
