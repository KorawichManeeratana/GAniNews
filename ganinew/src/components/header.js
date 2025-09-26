"use client";
import React, { useState } from "react";
import { Search, Menu, User, Bell, Plus} from "lucide-react";
import { NotificationDropdown } from "@/components/notiDropdown";
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/loginModal"
import { useRouter } from 'next/navigation';


export const Header = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const handleCreatePost = () => {
    router.push('/admin');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between py-1">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-violet-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <a href="/homepage" className="text-xl font-bold bg-violet-500 bg-clip-text text-transparent">
              GAniNews
            </a>
          </div>

          <></>

          {/* user-menu */}
          <div className="flex items-center space-x-2">
            {/* Create Post Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreatePost}
              className="hidden md:flex items-center gap-2"
            >
              Manage Post
            </Button>

            {/* Mobile menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>

            <NotificationDropdown/>

            <Button
              className="hover:bg-green-400 rounded-xl transition-colors p-2"
              variant="ghost"
              size="icon"
              onClick={() => setShowLogin(true)}
            >
              <User className="h-5 w-5 hover:text-white" />
            </Button>
          </div>
        </div>
      </div>

      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </header>
  );
};
