"use client";
import { useState } from "react";
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
const mockNewsDetails = {
  1: {
    id: "1",
    title: "Epic Fantasy RPG 'Dragon's Awakening' Gets Massive Update",
    thumbnail:
      "https://gaming-cdn.com/images/products/14833/orig-fallback-v1/expeditions-a-mudrunner-game-pc-game-steam-cover.jpg?v=1692966171",
    category: "Game",
    tags: ["RPG", "Fantasy", "Adventure"],
    timestamp: "2 hours ago",
    author: "GameReporter",
    likes: 156,
    isLiked: false,
    content: `
      <p>The highly anticipated update for Dragon's Awakening has finally arrived, and it's bigger than anyone expected. This massive content expansion introduces three entirely new regions, each with their own unique storylines, characters, and challenges that will keep players engaged for hours.</p>
      
      <h3>New Features Include:</h3>
      <ul>
        <li><strong>The Mystic Highlands:</strong> A mountainous region filled with ancient temples and powerful magical artifacts waiting to be discovered.</li>
        <li><strong>Enhanced Magic System:</strong> Players can now combine different schools of magic to create devastating combo spells.</li>
        <li><strong>Legendary Weapon Crafting:</strong> Forge powerful weapons using rare materials found throughout the world.</li>
        <li><strong>New Character Classes:</strong> Introduce the Spellblade and Shadow Walker, each with unique abilities and skill trees.</li>
      </ul>
      
      <p>The update also includes significant improvements to the game's graphics engine, with enhanced lighting effects and more detailed textures that bring the fantasy world to life like never before.</p>
      
      <p>Players have been praising the update's content quality, with many noting that the new storylines feel as polished and engaging as the original campaign. The development team has clearly listened to community feedback, addressing many of the quality-of-life improvements that players have been requesting.</p>
      
      <p>The update is available now for all platforms, with cross-platform progression ensuring that players can continue their adventures seamlessly across different devices.</p>
    `,
  },
  2: {
    id: "2",
    title: "Attack on Titan Final Season Part 4 Release Date Announced",
    thumbnail:
      "https://images.wallpapersden.com/image/download/ubisoft-assassin-s-creed-mirage-2023-game-poster_bWtnbmeUmZqaraWkpJRnZWltrWZmamc.jpg",
    category: "Anime",
    tags: ["Action", "Drama", "Fantasy"],
    timestamp: "4 hours ago",
    author: "AnimeInsider",
    likes: 342,
    isLiked: false,
    content: `
      <p>After months of speculation and anticipation, Studio WIT has officially announced the release date for Attack on Titan's final episodes. The concluding part of this epic saga will premiere this fall, bringing one of anime's most beloved series to its dramatic conclusion.</p>
      
      <h3>What to Expect:</h3>
      <ul>
        <li><strong>Epic Final Battles:</strong> The trailer showcases incredible action sequences that will leave fans breathless.</li>
        <li><strong>Character Resolutions:</strong> All major character arcs will reach their satisfying conclusions.</li>
        <li><strong>Stunning Animation:</strong> Studio WIT promises their highest quality animation work to date.</li>
        <li><strong>Extended Runtime:</strong> Each episode will be feature-length to properly conclude the story.</li>
      </ul>
      
      <p>Director Tetsuro Araki expressed his gratitude to fans for their patience and support throughout the series' run. "We wanted to ensure that we delivered the ending this incredible story deserves," he stated in a recent interview.</p>
      
      <p>The series has been a cultural phenomenon, influencing countless other anime and manga works. Its themes of freedom, sacrifice, and the nature of humanity have resonated with audiences worldwide, making it one of the most critically acclaimed anime series of the past decade.</p>
      
      <p>Fans can expect simultaneous global release across all major streaming platforms, ensuring that everyone can experience the conclusion together.</p>
    `,
  },
};

export default function Page(params) {
  const id = 2;
  const newsData = mockNewsDetails[id || "1"];
  const router = useRouter();

  const [likes, setLikes] = useState(newsData?.likes || 0);
  const [isLiked, setIsLiked] = useState(newsData?.isLiked || false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  function handleBackToHome() {
    router.push("/");
  }

  if (!newsData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">News Not Found</h1>
          <Button onClick={() => navigate("/")}>Return to Homepage</Button>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsData.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast here
    }
  };

  const categoryColor =
    newsData.category === "Game" ? "bg-primary" : "bg-accent";
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
              src={newsData.thumbnail}
              alt={newsData.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge className={`${categoryColor} text-white`}>
                {newsData.category}
              </Badge>
            </div>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {newsData.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{newsData.timestamp}</span>
              </div>
              <span>By {newsData.author}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              {newsData.tags.map((tag) => (
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
            dangerouslySetInnerHTML={{ __html: newsData.content }}
          />

          <Separator className="mb-8" />

          {/* Comments Section */}
          <CommentSection />
        </article>
      </main>
    </div>
  );
}
