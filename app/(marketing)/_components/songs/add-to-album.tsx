"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Album } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface AddToAlbumProps {
  song: Doc<"songs">;
}

export const AddToAlbum = ({ song }: AddToAlbumProps) => {
  const addSong = useMutation(api.albums.addSong);
  const removeSong = useMutation(api.albums.removeSong);

  const albums = useQuery(api.albums.getAlbums);
  const existingSongs = useQuery(api.songs.getByObjectId, {
    objectId: song.objectId,
  });

  const onAddSong = (songId: Id<"songs">, albumId: Id<"albums">) => {
    const promise = addSong({
      songId,
      albumId,
    });

    toast.promise(promise, {
      loading: "Adding to album...",
      success: "Song added to album!",
      error: "Failed to add song to album.",
    });
  };

  const onRemoveSong = (objectId: string, albumId: Id<"albums">) => {
    const promise = removeSong({
      objectId,
      albumId,
    });

    toast.promise(promise, {
      loading: "Removing from album...",
      success: "Song removed from album!",
      error: "Failed to remove song from album.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Album className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Song</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!albums || albums.length === 0 ? (
            <div className="flex justify-between items-center font-mono text-sm">
              No albums
            </div>
          ) : (
            albums.map((album) => {
              const existingInAlbum = existingSongs?.find(
                (existingSong) => existingSong.albumId === album._id
              );

              console.log(existingInAlbum);

              return (
                <div
                  className="flex justify-between items-center font-mono text-sm gap-2"
                  key={album._id}
                >
                  <Checkbox
                    checked={!!existingInAlbum}
                    onCheckedChange={(checked) =>
                      checked
                        ? onAddSong(song._id, album._id)
                        : onRemoveSong(song.objectId, album._id)
                    }
                  />
                  <label>{album.name}</label>
                </div>
              );
            })
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
