"use client";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  Bookmark,
  Calendar,
  Tag,
} from "lucide-react";
import { CommentSection } from "@/components/commentSec";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import React from "react"

export default function Page({ params }) {
  const router = useRouter();
  const id = React.use(params)
  const [newsDetail, setNewsDetail] = useState([])
  const [likes, setLikes] = useState(newsDetail?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  useEffect( () => {
    if (!id) return

    const fetchDetail = async () => {
      const res = await fetch(`/api/oneNews?id=${id.id}`) // ส่ง id ไป API
      const data = await res.json()
      setNewsDetail(data)
    }

    fetchDetail()
  }, [id.id])

  const tags = ["Action"]

  function handleBackToHome() {
    router.push("/");
  }

  if (!newsDetail) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">News Not Found</h1>
          <Button onClick={handleBackToHome}>Return to Homepage</Button>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    setIsLiked(likes);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsDetail.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast here
    }
  };

  const categoryColor =
    newsDetail.category === "Game" ? "bg-primary" : "bg-accent";
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={handleBackToHome} className="mb-6 p-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to News
        </Button>

        <article className="max-w-4xl mx-auto">
          {/* Header Image */}
          <div className="relative mb-8 rounded-lg overflow-hidden">
            <img
              src={newsDetail.thumbnail}
              alt={newsDetail.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge className={`${categoryColor} text-white`}>
                {newsDetail.category}
              </Badge>
            </div>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {newsDetail.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{newsDetail.created_at}</span>
              </div>
              <span>By {newsDetail.user}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              {tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleLike}
                className={isLiked ? "text-red-500 border-red-500" : ""}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`}
                />
                {likes}
              </Button>

              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              <Button
                variant="outline"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? "text-primary border-primary" : ""}
              >
                <Bookmark
                  className={`h-4 w-4 mr-2 ${
                    isBookmarked ? "fill-current" : ""
                  }`}
                />
                {isBookmarked ? "Saved" : "Save"}
              </Button>
            </div>
          </header>

          <Separator className="mb-8" />

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: newsDetail.body }}
          />

          <Separator className="mb-8" />

          {/* Comments Section */}
          <CommentSection />
        </article>
      </main>
    </div>
  );
}
