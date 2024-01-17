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
import { useMutation } from "convex/react";
import { Plus, Trash } from "lucide-react";
import { toast } from "sonner";

interface ArchiveProps {
  songs: Doc<"songs">[];
}

export const Archives: React.FC<ArchiveProps> = ({ songs }) => {
  const remove = useMutation(api.songs.remove);
  const addBack = useMutation(api.songs.addBack);

  const onReadd = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: Id<"songs">
  ) => {
    event.stopPropagation();
    if (!id) return;
    const promise = addBack({ id });

    toast.promise(promise, {
      loading: "Song added to tracks...",
      success: "song moved to tracks!",
      error: "Failed to add song.",
    });
  };

  const onRemove = (
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

  return (
    <div className="mt-4 w-full">
      <div className="text-left mb-10 font-bold">Archive</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Title</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs.map((song: Doc<"songs">) => (
            <TableRow key={song._id}>
              <TableCell className="text-left">{song.title}</TableCell>
              <TableCell className="flex justify-end">
                <div onClick={(e) => onReadd(e, song._id)}>
                  <Plus className="h-4 w-4 mr-2 cursor-pointer text-blue-500" />
                </div>
                <div onClick={(e) => onRemove(e, song._id)}>
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
