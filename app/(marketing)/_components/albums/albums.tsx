import { useMemo, useState } from "react";

import { api } from "@/convex/_generated/api";
import {  useQuery } from "convex/react";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

import { Input } from "../../../../components/ui/input";
import { Album } from "./album";
import { CreateAlbum } from "./create-album";

export const Albums = () => {
  const [keyword, setKeyword] = useState("");

  const albums = useQuery(api.albums.getAlbums);

  const albumFiltered = useMemo(() => {
    if (!albums) return [];

    return albums.filter((album) =>
      album.name.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [keyword, albums]);

  console.log(albums);

  return (
    <div className="mt-4 w-full">
      <div className="text-left mb-10 flex justify-between items-center">
        <div className="flex gap-2">
          <CreateAlbum />
        </div>
        <div className="flex relative w-96">
          <Input
            placeholder="Search album"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="rounded-r-none"
          />
          <Button
            variant="outline"
            className="hover:bg-transparent rounded-l-none border-l-0"
          >
            <Search className="h-full" />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {!albumFiltered.length ? (
          <div className="text-center">No album found.</div>
        ) : (
          albumFiltered.map((album) => <Album album={album} />)
        )}
      </div>
    </div>
  );
};
