import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { data } from "autoprefixer";

export const NotificationDropdown = () => {
  const [News, setNews] = useState([]);
  const router = useRouter();


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/notifications/getNoti");
        const data = await res.json();

        setNews(data);
      } catch (error) {
        console.error("Error fetching news in Notifications:", error);
      }
    };

    fetchPosts();
  }, []);

  function timeAgo(dateString) {
    const past = new Date(dateString.replace("Z", "+07:00"));
    const now = new Date();

    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return `${diffSec} วินาทีที่แล้ว`;
    if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
    if (diffHour < 24) return `${diffHour} ชั่วโมงที่แล้ว`;
    return `${diffDay} วันที่แล้ว`;
  }

  const now = new Date();
  const recentNews = News.filter((newsItem) => {
    const created = new Date(newsItem.create_at?.replace("Z", "+07:00"));
    const diffHours = (now - created) / (1000 * 60 * 60); // หาความต่างเป็นชั่วโมง
    return diffHours <= 24;
  });

  const handleToNews = (id) => {
    router.push("/newsDetail/" + id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="hover:bg-green-400">
        <Button variant="ghost" size="icon" className="relative ">
          <Bell className="h-5 w-5" />
          {recentNews.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full p-0"
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-popover">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {News.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            <p>ไม่มีการแจ้งเตือนขณะนี้ </p>
          </div>
        ) : (
          News.slice(0, 3).map((newsItem, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => handleToNews(newsItem.post_id)}
              className="p-3 bg-accent/50 cursor-pointer"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{newsItem.title}</p>
                </div>
                <pre className="text-xs text-muted-foreground">
                  {newsItem.content}
                </pre>
                <p className="text-xs text-muted-foreground">
                  {timeAgo(newsItem.create_at)}
                </p>
              </div>
            </DropdownMenuItem>
          ))
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center text-sm text-primary hover:bg-green-400">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
