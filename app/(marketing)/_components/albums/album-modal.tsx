"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Album } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";

import { Button } from "../../../../components/ui/button";
import { Albums } from "./albums";

export const AlbumModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Album className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Album</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <Albums />
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
