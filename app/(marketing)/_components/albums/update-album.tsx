"use client";

import { useRef, useState } from "react";

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
import { Edit } from "lucide-react";

import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

interface UpdateAlbumProps {
  album: Doc<"albums">;
}

export const UpdateAlbum = ({ album }: UpdateAlbumProps) => {
  const update = useMutation(api.albums.update);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const onUpdate = () => {
    if (!inputRef.current) return;

    const promise = update({
      id: album._id,
      name: inputRef.current.value,
    }).then(() => {
      inputRef.current!.value = "";
      setOpen(false);
    });

    toast.promise(promise, {
      loading: "Creating album...",
      success: "Album created!",
      error: "Failed to create album.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="hover:bg-transparent">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Update album</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Album name"
            ref={inputRef}
            defaultValue={album.name}
            className="rounded-r-none"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="button" onClick={onUpdate}>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
