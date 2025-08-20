import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart, MessageCircle, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";


export const NewsCard = ({
  id,
  title,
  body,
  image,
  category,
  genres,
  created_at,
  likes: initialLikes,
  comments,
  isLiked = false,
  description,
  onClick,
}) => {
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(isLiked);

    const handleLike = (e) => {
        e.stopPropagation();
        setLiked(!liked);
        setLikes(prev => liked ? prev - 1 : prev + 1);
    };
    
    const tags = genres.map((g) => g.genre.gen_name).join(", ")
    const categoryColor = category === "Game" ? "bg-purple-500" : "bg-green-500";

    function timeAgo(dateString) {
        const now = new Date()
        const past = new Date(dateString)
        const diffMs = now - past // ต่างกันเป็น milliseconds
        const diffSec = Math.floor(diffMs / 1000)
        const diffMin = Math.floor(diffSec / 60)
        const diffHour = Math.floor(diffMin / 60)
        const diffDay = Math.floor(diffHour / 24)

        if (diffSec < 60) return `${diffSec} วินาทีที่แล้ว`
        if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`
        if (diffHour < 24) return `${diffHour} ชั่วโมงที่แล้ว`
        return `${diffDay} วันที่แล้ว`
    }

    return(
    <Card 
      className="group cursor-pointer hover:shadow-card transition-all duration-300 hover:-translate-y-1"
      onClick={onClick}
    >
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge className={`${categoryColor} text-white`}>
              {category}
            </Badge>
          </div>
          <div className="absolute top-3 right-3 flex gap-1">
            {tags.split(",").slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <p className="text-muted-foreground text-sm line-clamp-2">
            {description}
          </p>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{timeAgo(created_at)}</span>
            {tags.length > 2 && (
              <>
                <Tag className="h-3 w-3 ml-2" />
                <span>+{tags.length - 2} more</span>
              </>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={`p-2 h-auto ${liked ? "text-red-500" : "text-muted-foreground"}`}
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-current" : ""}`} />
                <span className="text-xs">{likes}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-auto text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.();
                }}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">{comments.length}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    )
}