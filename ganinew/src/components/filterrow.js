
import { Badge } from "@/components/ui/badge";


const genres = [
  "RPG", "Fantasy", "Horror", "Adventure", "Action", "Romance", 
  "Comedy", "Drama", "Sci-Fi", "Mystery", "Slice of Life"
];

export const Filterrow = () => {
    const [selectedGenres, setSelectedGenres] = useState<string>([]);

    return (
        <div>
         {/* Filters Row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Genre Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="w-4 h-4 mr-2" />
              Genres
              {selectedGenres.length > 0 && (
                <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                  {selectedGenres.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 max-h-80 overflow-y-auto">
            <DropdownMenuLabel>Select Genres</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {genres.map((genre) => (
              <DropdownMenuCheckboxItem
                key={genre}
                checked={selectedGenres.includes(genre)}
                onCheckedChange={() => handleGenreToggle(genre)}
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
       </div>
       </div>
    );
}