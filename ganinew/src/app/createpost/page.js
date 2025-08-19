"use client";
import { Header } from "/src/components/header";
import { useEffect, useState } from "react";
import Editors from "@/components/editor";
import ImageUpload from "@/components/upload";
import Link from "next/link";
import createPost from "./action";

export const createpost = () => {
    const [content, setContent] = useState('')
    const [genresdata, setGenresdata] = useState([])
    const [selectgen, setSelectgen] = useState([])

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
        fetchdata()
    }, [])
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-center mb-6">

                <Link href="/homepage" className="inline-block min-w-[200px] text-center rounded-md px-4 py-2 font-semibold hover:bg-purple-500 hover:text-white transition">← Back to HomePage</Link>

            </div>
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 space-y-6">
                <h1 className="text-2xl font-bold text-purple-500">Create a New Post</h1>
                <form action={createPost} className="flex flex-col space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            name="title"
                            id="title"
                            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            placeholder="Enter post title"
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Post Content</label>
                        <Editors value={content} onChange={setContent} />
                        <input type="hidden" name="content" value={content} />
                    </div>

                    <div>
                        <label htmlFor="genres" className="block text-sm font-medium text-gray-700 mb-2">
                            Genres
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {genresdata.map((genre) => (
                                <button
                                    key={genre.id}
                                    type="button"
                                    onClick={() => togglegen(genre)}
                                    className={`px-4 py-1 rounded-full transition ${selectgen.find((g) => g.id === genre.id)
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-white hover:bg-purple-500 hover:text-white'
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
                    </div>
                    <div>
                        <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                            Thumbnail Image
                        </label>
                        <ImageUpload />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="mt-6 w-full bg-purple-500 text-white py-2 px-4 rounded-md shadow hover:bg-purple-400 transition"
                        >
                            Publish Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default createpost;
