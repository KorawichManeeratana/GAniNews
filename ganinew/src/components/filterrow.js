import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"

/**
 * @param {{ onFiltersChange?: (filters: { search: string, category: string, genres: string[] }) => void }} props
 */

const genres = [
  "RPG",
  "Fantasy",
  "Horror",
  "Adventure",
  "Action",
  "Romance",
  "Comedy",
  "Drama",
  "Sci-Fi",
  "Mystery",
  "Slice of Life",
];

export const Filterrow = ({ onFiltersChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGenres, setSelectedGenres] = useState([]); //เก็บ string

  const handleSearchChange = (value) => {
    setSearchQuery(value);

    if (onFiltersChange) {
      onFiltersChange({
        search: value,
        category: selectedCategory,
        genres: selectedGenres,
      });
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    if (onFiltersChange) {
      onFiltersChange({
        search: searchQuery,
        category: selectedCategory,
        genres: selectedGenres,
      });
    }
  };

  const handleSelectedGenres = (genre) => {
    const newGenres = selectedGenres.includes(genre) ? selectedGenres.filter((g) => g !== genre): [...selectedGenres, genre];

    setSelectedGenres(newGenres);
    if (onFiltersChange) {
      onFiltersChange({
        search: searchQuery,
        category: selectedCategory,
        genres: selectedGenres,
      });
    };
  };

  const clearGenres = (genre) => {
    setSelectedGenres([]);

    if (onFiltersChange) {
      onFiltersChange({
        search: searchQuery,
        category: selectedCategory,
        genres: selectedGenres,
      });
    };
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for games, anime, or keywords..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={handleCategoryChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="game">Games</TabsTrigger>
          <TabsTrigger value="anime">Anime</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters Row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Genre Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="w-4 h-4 mr-2" />
              Genres
              {selectedGenres.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 px-1.5 py-0.5 text-xs"
                >
                  {selectedGenres.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-56 max-h-80 overflow-y-auto"
          >
            <DropdownMenuLabel>Select Genres</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {genres.map((genre) => (
              <DropdownMenuCheckboxItem
                key={genre}
                checked={selectedGenres.includes(genre)}
                onCheckedChange={() => handleSelectedGenres(genre)}
              >
                {genre}
              </DropdownMenuCheckboxItem>
            ))}
            {selectedGenres.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearGenres}
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </Button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active Genre Badges */}
        {selectedGenres.map((genre) => (
          <Badge key={genre} variant="secondary" className="text-xs">
            {genre}
            <button
              onClick={() => handleSelectedGenres(genre)}
              className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}

      </div>
    </div>
  );
};
