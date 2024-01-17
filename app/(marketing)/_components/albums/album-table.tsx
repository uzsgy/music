"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Plus, Trash } from "lucide-react";
import { toast } from "sonner";

interface AlbumTableProps {
  album: Doc<"albums">;
}

export const AlbumTable = ({ album }: AlbumTableProps) => {
  const removeSong = useMutation(api.albumSongs.remove);
  const addSongToList = useMutation(api.songs.addToListById);

  const songs = useQuery(api.songs.getByAlbumId, {
    id: album._id,
  });

  const onAddSongToList = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: Id<"songs">
  ) => {
    event.stopPropagation();
    const promise = addSongToList({ id });

    toast.promise(promise, {
      loading: `Song adding to album ${album.title}...`,
      success: `Song added to album ${album.title}!`,
      error: `Failed to add song to ${album.title}.`,
    });
  };

  const onRemoveSong = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    songId: Id<"songs">
  ) => {
    event.stopPropagation();
    if (!album || !songId) return;
    const promise = removeSong({ albumId: album._id, songId });

    toast.promise(promise, {
      loading: `Song adding to album ${album.title}...`,
      success: `Song added to album ${album.title}!`,
      error: `Failed to add song to ${album.title}.`,
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[400px]">Title</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!songs ? (
          <TableRow>
            <TableCell className="text-center">Loading...</TableCell>
          </TableRow>
        ) : songs.length === 0 ? (
          <TableRow>
            <TableCell className="text-center">
              No songs in this album.
            </TableCell>
          </TableRow>
        ) : (
          songs.map((song: Doc<"songs"> | null) => {
            return !!song ? (
              <TableRow key={song._id}>
                <TableCell className="text-left">{song.title}</TableCell>
                <TableCell className="flex justify-end">
                  <div onClick={(e) => onAddSongToList(e, song._id)}>
                    <Plus className="h-4 w-4 mr-2 cursor-pointer text-blue-500" />
                  </div>
                  <div onClick={(e) => onRemoveSong(e, song._id)}>
                    <Trash className="h-4 w-4 cursor-pointer text-red-500" />
                  </div>
                </TableCell>
              </TableRow>
            ) : null;
          })
        )}
      </TableBody>
    </Table>
  );
};
