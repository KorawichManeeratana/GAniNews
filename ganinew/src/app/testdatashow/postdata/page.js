"use client"

import { useEffect, useState } from "react"

export default function PostsPage() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch("/api/testdata")
      .then((res) => res.json())
      .then((data) => setPosts(data))
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">📢 Latest Posts</h1>

      <div className="grid gap-6 max-w-3xl mx-auto">
        {posts.map((post) => (
          
          <div
            key={post.id}
            className="bg-white rounded-2xl shadow-lg p-6 border hover:shadow-xl transition"
          >
            <img src={post.image} alt="Girl in a jacket"/>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {post.title}
            </h2>

            <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                {post.category}
              </span>
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full">
                {post.status}
              </span>
            </div>


            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />

            <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
              <span>❤️ {post.likes} likes</span>
              <span>
                📅 {new Date(post.created_at).toLocaleDateString("th-TH")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
