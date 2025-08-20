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



export const NotificationDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="hover:bg-green-400">
        <Button variant="ghost" size="icon" className="relative ">
          <Bell className="h-5 w-5" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            2
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-popover">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="p-3 bg-accent/50 cursor-pointer">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">New RPG Release</p>
              <div className="h-2 w-2 bg-primary rounded-full" />
            </div>
            <p className="text-xs text-muted-foreground">
              Final Fantasy XVI DLC announced
            </p>
            <p className="text-xs text-muted-foreground">2 hours ago</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem className="p-3 bg-accent/50 cursor-pointer">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">Anime Update</p>
              <div className="h-2 w-2 bg-primary rounded-full" />
            </div>
            <p className="text-xs text-muted-foreground">
              Attack on Titan final season date revealed
            </p>
            <p className="text-xs text-muted-foreground">5 hours ago</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem className="p-3 cursor-pointer">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">Gaming News</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Your comment received 5 likes
            </p>
            <p className="text-xs text-muted-foreground">1 day ago</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center text-sm text-primary hover:bg-green-400">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};