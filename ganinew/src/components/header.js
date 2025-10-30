"use client";
import React, { useEffect, useState } from "react";
import { Search, Menu, User, Bell, Plus } from "lucide-react";
import { NotificationDropdown } from "@/components/notiDropdown";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/loginModal";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSWR, { mutate } from "swr";
import { fetcherWithCredentials } from "@/lib/fetcher";


export const Header = () => {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);

  const { data, error, isLoading } = useSWR("/api/auth/me", fetcherWithCredentials, {
    revalidateOnFocus: true, // revalidate เมื่อ window กลับมา foreground
    dedupingInterval: 2000, // ป้องกันการเรียกซ้ำภายในช่วงเวลา
    shouldRetryOnError: false,
  });

  const user = data?.user ?? null; // กำหนด data

  const handleCreatePost = () => {
    router.push("/admin");
  };

  const handleToProfile = () => {
    router.push("/profile/" + user.id);
  }

  const handleToHome = () => {
    router.push("/");
  }

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // ต้องส่ง HttpOnly cookie
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      mutate("/api/auth/me", null, false); // เคลียร์ข้อมูล user ทันที
      router.push("/"); // กลับไปหน้า homepage
    } catch (err) {
      console.error("Logout error:", err);
    }
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between py-1">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-violet-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <a
              onClick={handleToHome}
              className="text-xl font-bold bg-violet-500 bg-clip-text text-transparent"
            >
              GAniNews
            </a>
          </div>

          <></>

          {/* user-menu */}
          <div className="flex items-center space-x-2">
            {/* Create Post Button */}
           { user && user.role === "admin" ? (<Button
              variant="outline"
              size="sm"
              onClick={handleCreatePost}
              className="hidden md:flex items-center gap-2"
            >
              Manage Post
            </Button>) : <></>}

            {/* Mobile menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>

            <NotificationDropdown />

            {user ? (
              <div className="flex items-center gap-2 ml-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar>
                      <AvatarImage src={user.user_info.photo} alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem onClick={handleToProfile}>
                      Profile
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem onClick={handleLogout}>Logout</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                className="hover:bg-green-400 rounded-xl transition-colors p-2"
                variant="ghost"
                size="icon"
                onClick={() => setShowLogin(true)}
              >
                <User className="h-5 w-5 hover:text-white" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <LoginModal open={showLogin} onOpenChange={setShowLogin} onLoginSuccess={() => {mutate("/api/auth/me"); setShowLogin(false);}} />
    </header>
  );
};
