"use client";

import { useMutation, useQuery } from "convex/react";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast } from "sonner";
import { Edit, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const Songs = () => {
  const songs = useQuery(api.songs.getSongs, {});
  const remove = useMutation(api.songs.remove);
  const [currentSong, setCurrentSong] = useState<Doc<"songs"> | null>(null);

  const onArchive = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: Id<"songs">
  ) => {
    event.stopPropagation();
    if (!id) return;
    const promise = remove({ id });

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Tag moved to trash!",
      error: "Failed to archive song.",
    });
  };

  useEffect(() => {}, [songs]);

  console.log(songs?.[0]?._id, currentSong?._id, currentSong?.process);

  if (
    songs &&
    songs.length !== 0 &&
    currentSong &&
    songs[0]._id !== currentSong._id
  ) {
    setCurrentSong(songs[0]);
  }

  if (songs === undefined || songs.length === 0) {
    return (
      <div className="mt-4 w-full flex h-full items-center justify-center">
        <p className={cn("block text-sm font-medium text-muted-foreground/80")}>
          No songs founded.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 w-full">
      <iframe
        // className="hidden"
        width="560"
        height="315"
        src={`${currentSong?.url}?&amp;start=${currentSong?.process}&amp;autoplay=1&amp;v=${currentSong?._id}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Title</TableHead>
            <TableHead className="w-fit">Link</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs.map((song: Doc<"songs">) => (
            <TableRow key={song._id}>
              <TableCell>{song.title}</TableCell>
              <TableCell className="font-medium text-left">
                <a href={song.url} target="_blank">
                  {song.url}
                </a>
              </TableCell>
              <TableCell className="flex justify-end">
                <div onClick={() => console.log(song)}>
                  <Edit className="h-4 w-4 mr-2 cursor-pointer text-blue-500" />
                </div>
                <div onClick={(e) => onArchive(e, song._id)}>
                  <Trash className="h-4 w-4 cursor-pointer text-red-500" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
