"use client";
import React, { useState } from 'react';
import { Search, Menu, User } from 'lucide-react';

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between py-1">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-violet-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <h1 className="text-xl font-bold bg-violet-500 bg-clip-text text-transparent">
              GAniNews
            </h1>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search games, anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-2 w-full rounded-2xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Mobile Search */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
            type='text'
              placeholder="Search games, anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

          {/* user-menu */}
        <div className="flex items-center space-x-2">

          {/* Mobile menu */}
            <button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </button>

          <button
                className="hover:bg-green-400 rounded-xl transition-colors p-2"
                variant="ghost"
                size="icon"
                onClick={() => setShowLogin(true)}
              >
                <User className="h-5 w-5 hover:text-white"/>
          </button>
        </div>
        </div>
      </div>
    </header>
  );
};