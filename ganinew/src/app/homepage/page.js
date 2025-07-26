"use client";

import { Header } from "/src/components/header";
import { useState } from "react";
import { Search, Clock, Star, TrendingUp } from "lucide-react";
import { Filterrow } from "@/components/filterrow";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { NewsCard } from "@/components/newsCard";

const mockNews = [
  {
    id: "1",
    title: "Epic Fantasy RPG 'Dragon's Awakening' Gets Massive Update",
    description: "The latest update introduces new storylines, character classes, and an entirely new realm to explore. Players can now experience enhanced magic systems and legendary weapons.",
    thumbnail: "https://gaming-cdn.com/images/products/14833/orig-fallback-v1/expeditions-a-mudrunner-game-pc-game-steam-cover.jpg?v=1692966171",
    category: "Game",
    tags: ["RPG", "Fantasy", "Adventure"],
    timestamp: "2 hours ago",
    likes: 156,
    comments: 23,
  },
  {
    id: "2",
    title: "Attack on Titan Final Season Part 4 Release Date Announced",
    description: "Studio WIT reveals the official release date for the highly anticipated final episodes. Fans can expect incredible animation and epic battles in the conclusion of this beloved series.",
    thumbnail: "https://tse1.mm.bing.net/th/id/OIP.Tv2cyykwqI8K1J7I7_urbwHaEK?pid=Api&P=0&h=180",
    category: "Anime",
    tags: ["Action", "Drama", "Fantasy"],
    timestamp: "4 hours ago",
    likes: 342,
    comments: 67,
  },
  {
    id: "3",
    title: "Cyberpunk 2078: Next-Gen Gaming Experience Preview",
    description: "Get an exclusive look at the upcoming cyberpunk adventure that promises to redefine open-world gaming with AI-driven NPCs and revolutionary graphics technology.",
    thumbnail: "https://venturebeat.com/wp-content/uploads/2013/02/candycrushsaga.jpg?strip=all",
    category: "Game",
    tags: ["Action", "Sci-Fi", "Adventure"],
    timestamp: "6 hours ago",
    likes: 89,
    comments: 12,
  },
  {
    id: "4",
    title: "Magical Academy Anime 'Arcane Scholars' Trailer Released",
    description: "A new magical school anime promises breathtaking animation and compelling character development. Follow students as they master ancient spells and face mystical challenges.",
    thumbnail: "https://images.wallpapersden.com/image/download/ubisoft-assassin-s-creed-mirage-2023-game-poster_bWtnbmeUmZqaraWkpJRnZWltrWZmamc.jpg",
    category: "Anime",
    tags: ["Fantasy", "Romance", "Adventure"],
    timestamp: "8 hours ago",
    likes: 201,
    comments: 45,
  },
];


export const Page = () => {
  const [selected, setSelected] = useState("All");
  const router = useRouter();
  const [filteredNews, setFilteredNews] = useState(mockNews);
  const [activeFilter, setActiveFilter] = useState("trending");

  const goToPath = () => {
    router.push('/');
  };

  const handleFiltersChange = (filters) => {
    let filtered = [...mockNews];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (news) =>
          news.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          news.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          news.tags.some((tag) =>
            tag.toLowerCase().includes(filters.search.toLowerCase())
          )
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(
        (news) => news.category.toLowerCase() === filters.category
      );
    }

    // Genre filter
    if (filters.genres.length > 0) {
      filtered = filtered.filter((news) =>
        filters.genres.some((genre) => news.tags.includes(genre))
      );
    }

    setFilteredNews(filtered);
  };

  const handleNewsClick = (newsId) => {
    goToPath();
  };

  const filterButtons = [
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "recent", label: "Recent", icon: Clock },
    { id: "popular", label: "Popular", icon: Star },
  ];


  const tabs = ["All", "Games", "Anime"];
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center object-cover"
          style={{
            backgroundImage: "url(https://wallpaperaccess.com/full/42630.jpg)",
          }}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>

        <div className="relative container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Latest in{" "}
            <span className="bg-violet-500 bg-clip-text text-transparent">
              Gaming
            </span>{" "}
            &{" "}
            <span className="bg-green-500 bg-clip-text text-transparent">
              Anime
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto ">
            Stay updated with the hottest news, reviews, and updates from the
            world of games and anime
          </p>
        </div>
      </section>
      <main className="container mx-auto px-4 py-8">
        {/* Search & Filters */}
        <div className="mb-8">
          <Filterrow onFiltersChange={handleFiltersChange} />
        </div>

        {/* Filter Tabs */}
          <div className="mb-6">
          <div className="flex gap-2">
            {filterButtons.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.id)}
                className="flex items-center gap-2"
              >
                <filter.icon className="h-4 w-4" />
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNews.map((news) => (
            <NewsCard
              key={news.id}
              {...news}
              onClick={() => handleNewsClick(news.id)}
            />
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No news found matching your filters.
            </p>
          </div>
        )}

      </main>
    </div>
  );
};

export default Page;
