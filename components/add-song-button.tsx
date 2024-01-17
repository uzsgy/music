"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface AddSongButtonProps {
  song: Doc<"songs">;
}

export const AddSongButton = ({ song }: AddSongButtonProps) => {
  const addToListById = useMutation(api.songs.addToListById);

  const onAddToListById = () => {
    if (!song) return;
    const promise = addToListById({ id: song._id });

    toast.promise(promise, {
      loading: "Song added to tracks...",
      success: "song moved to tracks!",
      error: "Failed to add song.",
    });
  };

  return (
    <Button onClick={onAddToListById} size="sm" variant="ghost">
      <Plus className="h-4 w-4" />
    </Button>
  );
};
