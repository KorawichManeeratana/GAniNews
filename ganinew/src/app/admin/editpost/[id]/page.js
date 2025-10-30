"use client";
import dynamic from 'next/dynamic';
const Editors = dynamic(() => import('@/components/editor'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>
});
import { useEffect, useState } from "react";
import ImageUpload from "@/components/upload";
import Link from "next/link";
import { useParams } from "next/navigation";
import updatePost from "./action";

export const Editpost = () => {
    const params = useParams();
    const postid = params?.id;
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState([]);
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [genresdata, setGenresdata] = useState([]);
    const [selectgen, setSelectgen] = useState([]);
    const [thumbnail, setThumbnail] = useState('');

    const togglegen = (genreId) => {
        if (selectgen.includes(genreId)) {
            setSelectgen(prevItems => prevItems.filter(id => id !== genreId));
        } else {
            setSelectgen(prevItems => [...prevItems, genreId]);
        }
    };

    useEffect(() => {
        const fetchGenresData = async () => {
            try {
                const res = await fetch('/api/genres');
                const data = await res.json();
                setGenresdata(data);
            } catch (err) {
                console.log("Error is : ", err);
            }
        };

        const fetchPostData = async () => {
            setSelectgen([]);
            try {
                const respost = await fetch('/api/news/getAllNews');
                const postdata = await respost.json();
                const result = postdata.find(i => String(i.id) === String(postid));
                if (result) {
                    setContent(result.body || "");
                    setPost([result]);

                    if (result.image) {
                        console.log("Thumbnail found:", result.image);
                        setThumbnail(result.image);
                    } else {
                        console.log("No image field found in result");
                    }

                    const oldgen = result.genres?.map(i => i.genre?.id) || [];
                    setSelectgen(oldgen);
                    setCategory(result.category || "");
                }

            } catch (err) {
                console.log("Error fetching post:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPostData();
        fetchGenresData();
    }, [postid]);

    useEffect(() => {
        console.log("Thumbnail updated:", thumbnail);
    }, [thumbnail]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-center mb-6">
                <Link
                    href="/admin"
                    className="inline-block min-w-[200px] text-center rounded-md px-4 py-2 font-semibold hover:bg-purple-500 hover:text-white transition"
                >
                    ← Back to Admin Page
                </Link>
            </div>

            {loading && (
                <p className="text-center text-gray-500">Loading post...</p>
            )}

            {!loading && post.length > 0 && post.map((i, index) => (
                <div key={index} className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 space-y-6">
                    <h1 className="text-2xl font-bold text-purple-500">Edit Post</h1>

                    <form action={updatePost} className="flex flex-col space-y-4">
                        <input type="hidden" name="postid" value={postid} />

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                name="title"
                                id="title"
                                defaultValue={i.title}
                                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                placeholder="Enter post title"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <input
                                name="description"
                                id="description"
                                defaultValue={i.description}
                                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                placeholder="Enter post description"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            >
                                <option value="Game">Game</option>
                                <option value="Anime">Anime</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Post Content
                            </label>
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
                                        onClick={() => togglegen(genre.id)}
                                        className={`px-4 py-1 rounded-full transition ${selectgen.includes(genre.id)
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
                                    value={JSON.stringify(selectgen)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                                Thumbnail Image
                            </label>

                            {thumbnail && (
                                <img
                                    src={thumbnail}
                                    alt="Current Thumbnail"
                                    className="w-40 h-40 object-cover rounded-md mb-2 border"
                                />
                            )}

                            <ImageUpload onUpload={(link) => setThumbnail(link)} />
                            <input
                                type="hidden"
                                name="file"
                                value={thumbnail || ""}
                            />
                        </div>

                        <div className="flex flex-col items-center">
                            <button
                                type="submit"
                                className="mt-6 w-full bg-purple-500 text-white py-2 px-4 rounded-md shadow hover:bg-purple-400 transition cursor-pointer"
                            >
                                Save Change
                            </button>
                        </div>
                    </form>
                </div>
            ))}
        </div>
    );
};

export default Editpost;