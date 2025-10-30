"use client";
import { useRef, useState, useEffect } from "react";
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
import { ReportModal } from "@/components/reportModal";
import React from "react";
import RequireLoginAlert from "@/components/requireLoginAlert";

export default function Page({ params }) {
  const router = useRouter();
  const id = React.use(params);
  const [newsDetail, setNewsDetail] = useState([]);
  const [newAddon, setNewAddon] = useState({
    likes: 0,
    isLiked: false,
    isBookmarked: false,
    isReportOpen: false,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  var tags = [];

  const likeTimerRef = useRef(null);
  const bookmarkTimerRef = useRef(null);
  const pendingRequestRef = useRef(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      const res = await fetch(`/api/news/oneNews?id=${id.id}`);
      const data = await res.json();

      setNewsDetail(data);
      setNewAddon((prev) => ({
        ...prev,
        likes: data.likes || 0,
        isLiked: data.userHasLiked || false,
        isBookmarked: data.userHasBookmarked || false,
      }));
      setIsLoggedIn(!!data.usersub);
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

  function requireLogin(action) {
    if (!isLoggedIn) {
      setShowLoginAlert(true); // เปิด alert dialog
      return;
    }
    action();
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

    if (likeTimerRef.current) clearTimeout(likeTimerRef.current);
    likeTimerRef.current = setTimeout(async () => {
      await fetch("/api/post/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: newsDetail.id,
          isLiked: !newAddon.isLiked,
        }),
      });
      likeTimerRef.current = null;
    }, 1500);
  };

  const handleReport = () => {
    setNewAddon((prev) => ({ ...prev, isReportOpen: true }));
  };

  const handleReportChange = (open) => {
    setNewAddon((prev) => ({ ...prev, isReportOpen: !!open }));
  };

  const handleBookmark = () => {
    setNewAddon((prev) => ({ ...prev, isBookmarked: !prev.isBookmarked }));

    if (bookmarkTimerRef.current) clearTimeout(bookmarkTimerRef.current);

    bookmarkTimerRef.current = setTimeout(async () => {
      await fetch("/api/post/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: newsDetail.id,
          isBookmarked: !newAddon.isBookmarked,
        }),
      });
      bookmarkTimerRef.current = null;
    }, 1500);
  };

  function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString.replace("Z", "+07:00"));
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

  const handleReportSubmit = async (payload) => {
    try {
      const res = await fetch("/api/CreateReport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // payload = { postId, topics, detail }
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || "Failed to submit report");
      }

      const data = await res.json();
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
            {!newsDetail?.image ? (
              <div className="w-full h-64 md:h-96 bg-gray-200 animate-pulse rounded-lg" />
            ) : (
              <img
                src={newsDetail.image}
                alt={newsDetail.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            )}
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
                <span>
                  {newsDetail?.created_at
                    ? timeAgo(newsDetail.created_at)
                    : "กำลังโหลด..."}
                </span>
              </div>
              <span>
                By{" "}
                {newsDetail.user?.username
                  ? newsDetail.user?.username
                  : "กำลังโหลด..."}
              </span>
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
                onClick={() => requireLogin(handleLike)}
                className={`flex items-center ${
                  newAddon.isLiked
                    ? "text-red-500 border-red-500 !important"
                    : ""
                }`}
              >
                <Heart
                  className={`h-4 w-4 mr-2 fill-current ${
                    newAddon.isLiked ? "text-red-500" : "text-gray-500"
                  }`}
                />
                {newAddon.likes}
              </Button>

              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              <Button
                variant="outline"
                onClick={() => requireLogin(handleBookmark)}
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

              <Button
                variant="outline"
                onClick={() => requireLogin(handleReport)}
              >
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
          <CommentSection id={id.id} cognitoSub={newsDetail.usersub} />
        </article>
        <ReportModal
          postId={newsDetail.id}
          open={newAddon.isReportOpen}
          onOpenChange={handleReportChange}
          onSubmit={handleReportSubmit}
        />
        <RequireLoginAlert
          showLoginAlert={showLoginAlert}
          setShowLoginAlert={setShowLoginAlert}
        />
      </main>
    </div>
  );
}
