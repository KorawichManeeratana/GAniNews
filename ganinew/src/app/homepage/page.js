"use client";
import { Header } from "/src/components/header";
import { useEffect, useState } from "react";
import { Search, Clock, Star, TrendingUp } from "lucide-react";
import { Filterrow } from "@/components/filterrow";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NewsCard } from "@/components/newsCard";

export const Page = (params) => {
  /*  const [selected, setSelected] = useState("All"); */
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [filteredNews, setFilteredNews] = useState(null);
  const [activeFilter, setActiveFilter] = useState("trending");
  const [allNews, setAllNews] = useState(null);


  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/news/getAllNews");
        const data = await res.json();

        setFilteredNews(data);
        setAllNews(data);

      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleFiltersChange = (filters) => {
    let filtered = [...allNews];
    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (news) =>
          news.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          news.description
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          news.genres.some((tag) =>
            tag.genre.gen_name.toLowerCase().includes(filters.search.toLowerCase())
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
        filters.genres.some((genre) => news.genres.map((tag) => tag.genre.gen_name).includes(genre))
      );
    }

    setFilteredNews(filtered);
  };

  const handleActiveFileChange = (filter) => {
    setActiveFilter(filter);

    let filtered = [...allNews];

    if (filter === "recent") {

      filtered = filtered.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

    } else if (filter === "popular") {
      filtered = filtered.filter((news) => news.likes >= 0).sort((a, b) => b.likes - a.likes);
    }

    setFilteredNews(filtered);
  }

  function handleNewsClick(newsId) {
    router.push(`/newsDetail/${newsId}`);
  }

  const filterButtons = [
    { id: "popular", label: "Popular", icon: Star },
    { id: "recent", label: "Recent", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-background">
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
                onClick={() => handleActiveFileChange(filter.id)}
                className="flex items-center gap-2"
              >
                <filter.icon className="h-4 w-4" />
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            {/* สมมติว่าไฟล์ GIF อยู่ที่ public/cat_loading.gif */}
            <img
              src="images/cat_loading.gif"
              alt="Loading..."
              className="w-40 h-40 object-contain"
              aria-live="polite"
            />
          </div>
        ) : (
          <>
            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNews.map((newsItem) => (
                
                <NewsCard
                  key={newsItem.id}
                  {...newsItem}
                  onClick={() => handleNewsClick(newsItem.id)}
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
          </>
        )}
      </main>
    </div>
  );
};

export default Page;
