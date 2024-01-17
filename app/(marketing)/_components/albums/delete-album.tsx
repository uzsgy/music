"use client";

import { useState } from "react";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { Trash } from "lucide-react";

import { Button } from "../../../../components/ui/button";

interface DeleteAlbumProps {
  album: Doc<"albums">;
}

export const DeleteAlbum = ({ album }: DeleteAlbumProps) => {
  const remove = useMutation(api.albums.remove);
  const [open, setOpen] = useState(false);

  const onDelete = () => {
    const promise = remove({ id: album._id }).then(() => {
      setOpen(false);
    });

    toast.promise(promise, {
      loading: "Deleting album...",
      success: "Album deleted!",
      error: "Failed to delete album.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="hover:bg-transparent">
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Delete album {album.name}</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="button" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
