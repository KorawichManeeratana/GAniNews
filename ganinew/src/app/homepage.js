"use client";

import { Header } from "/components/header"
import { Search, Clock, Star, TrendingUp } from "lucide-react";


export const HomePage = () => {
  return <div className="min-h-screen bg-background">
    <Header/>
      <section className="relative py-20 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center object-cover"
          style={{ backgroundImage: 'url(https://wallpaperaccess.com/full/42630.jpg)' }}
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
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-gray-400">
            Stay updated with the hottest news, reviews, and updates from the world of games and anime
          </p>
        </div>
      </section>
    <main className="container mx-auto px-4 py-8">

        {/* Search & Filters */}
        <div className="mb-8">
          <div className="hidden md:flex w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search games, anime..."
                className="pl-10 py-2 w-full rounded-2xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        </div>

      {/* Filter Tabs */}
        </main>
    </div>
}

export default HomePage;