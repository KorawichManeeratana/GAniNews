"use client";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  Bookmark,
  Calendar,
  Tag,
  Flag,
} from "lucide-react";
import { CommentSection } from "@/components/commentSec";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { ReportModal }  from "@/components/reportModal";
import React from "react";

export default function Page({ params }) {
  const router = useRouter();
  const id = React.use(params);
  const [newsDetail, setNewsDetail] = useState([]);
  const [newAddon, setNewAddon] = useState({
    likes: newsDetail?.likes || 0,
    isLiked: false,
    isBookmarked: false,
    isReportOpen: false,
  });
  var tags = [];
  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      const res = await fetch(`/api/oneNews?id=${id.id}`); // ส่ง id ไป API
      const data = await res.json();
      setNewsDetail(data);
    };

    fetchDetail();
  }, [id.id]);

  if (newsDetail?.genres && newsDetail.genres.length > 0) {
    const genreNames = newsDetail?.genres.map((item) => item.genre.gen_name);
    tags = genreNames;
  }

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
    setNewAddon((prev) => {
      const isLiked = !prev.isLiked;
      const likes = isLiked ? prev.likes + 1 : prev.likes - 1;
      return { ...prev, isLiked, likes };
    });
  };

  const handleReport = () => {
    setNewAddon((prev) => ({ ...prev, isReportOpen: true }));
    console.log(newAddon.isReportOpen);
  };

  const handleReportChange = (open) => {
    setNewAddon((prev) => ({ ...prev, isReportOpen: !!open }));
  };

  const handleBookmark = () => {
    setNewAddon((prev) => ({ ...prev, isBookmarked: !prev.isBookmarked }));
  };

  const handleReportSubmit = async (payload) => {
  try {
    const res = await fetch("/api/CreateReport", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload) // payload = { postId, topics, detail }
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.error || "Failed to submit report");
    }

    const data = await res.json();
    console.log("Report submitted successfully:", data);

    return data;
  } catch (err) {
    console.error("Report submission failed:", err);
    throw err;
  }
};

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsDetail.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
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
              src={newsDetail.image}
              alt={newsDetail.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge className={`${categoryColor} text-gray`}>
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
              <span>By {newsDetail.user?.username}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  <Tag className=" h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleLike}
                className={
                  newAddon.isLiked ? "text-red-500 border-red-500" : ""
                }
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${
                    newAddon.isLiked ? "fill-current" : ""
                  }`}
                />
                {newAddon.isLiked}
              </Button>

              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              <Button
                variant="outline"
                onClick={() => handleBookmark}
                className={
                  newAddon.isBookmarked ? "text-primary border-primary" : ""
                }
              >
                <Bookmark
                  className={`h-4 w-4 mr-2 ${
                    newAddon.isBookmarked ? "fill-current" : ""
                  }`}
                />
                {newAddon.isBookmarked ? "Saved" : "Save"}
              </Button>

              <Button variant="outline" onClick={() => handleReport()}>
                <Flag className="h-4 w-4 mr-2" />
                Report
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
          <CommentSection id={id.id}/>
        </article>
        <ReportModal
          postId={newsDetail.id}
          open={newAddon.isReportOpen}
          onOpenChange={handleReportChange}
          onSubmit={handleReportSubmit}
        />
      </main>
    </div>
  );
}
