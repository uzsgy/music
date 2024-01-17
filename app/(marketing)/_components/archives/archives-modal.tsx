"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Archive, Trash } from "lucide-react";
import { toast } from "sonner";
import { AddSongButton } from "@/components/add-song-button";

import { AddToAlbum } from "../songs/add-to-album";
import { Button } from "../../../../components/ui/button";

export const ArchivesModal = () => {
  const songsInArchive = useQuery(api.songs.getArchivedSongs);
  const remove = useMutation(api.songs.remove);

  const onRemove = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Archive className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Archive</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="text-right w-24">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!songsInArchive ? (
                <div className="w-full min-h-full flex items-center justify-center">
                  Loading...
                </div>
              ) : songsInArchive.length === 0 ? (
                <div className="w-full min-h-full flex items-center justify-center">
                  No songs founded.
                </div>
              ) : (
                songsInArchive.map((song: Doc<"songs">) => (
                  <TableRow key={song._id}>
                    <TableCell className="text-left">{song.title}</TableCell>
                    <TableCell className="flex justify-end">
                      <AddToAlbum song={song} />
                      <AddSongButton song={song} />
                      <Button
                        onClick={(e) => onRemove(e, song._id)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash className="h-4 w-4 cursor-pointer text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
