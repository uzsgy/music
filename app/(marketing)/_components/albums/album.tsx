"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { ChevronDown, ChevronUp, Edit, Play, Plus, Trash } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "../../../../components/ui/input";
import { toast } from "sonner";
import { UpdateAlbum } from "./update-album";
import { DeleteAlbum } from "./delete-album";
import { AddSongButton } from "@/components/add-song-button";
import { object } from "zod";

interface AlbumProps {
  album: Doc<"albums">;
}

const ListSong = ({ album }: AlbumProps) => {
  const removeSong = useMutation(api.albums.removeSong);
  const songs = useQuery(api.songs.getByAlbumId, {
    id: album._id,
  });

  const onRemoveSong = (objectId: string) => {
    const promise = removeSong({
      objectId,
      albumId: album._id,
    });

    toast.promise(promise, {
      loading: "Removing from album...",
      success: "Song removed from album!",
      error: "Failed to remove song from album.",
    });
  };

  if (!songs || songs.length === 0) {
    return (
      <div className="flex justify-between items-center font-mono text-sm">
        No songs
      </div>
    );
  }

  return (
    <>
      {songs.map((song, idx) => (
        <div
          className="flex justify-between items-center font-mono text-sm"
          key={song._id}
        >
          {idx + 1}. {song.title}
          <div className="flex items-center gap-2">
            <AddSongButton song={song} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveSong(song.objectId)}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </>
  );
};

export const Album = ({ album }: AlbumProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="space-y-2 border rounded"
    >
      <div className="flex items-center justify-between space-x-4 pl-4 border-b">
        <CollapsibleTrigger>{album.name}</CollapsibleTrigger>
        <div className="flex items-center gap-2">
          <UpdateAlbum album={album} />
          <DeleteAlbum album={album} />
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent className="space-y-2 px-3 py-2">
        {isOpen && <ListSong album={album} />}
      </CollapsibleContent>
    </Collapsible>
  );
};
