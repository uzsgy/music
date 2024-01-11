"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useAddSong } from "@/hooks/use-add-song";
import { api } from "@/convex/_generated/api";

export const SearchCommand = () => {
  const router = useRouter();
  const songs = useQuery(api.songs.getSongs);
  const [isMounted, setIsMounted] = useState(false);

  const toggle = useAddSong((store) => store.toggle);
  const isOpen = useAddSong((store) => store.isOpen);
  const onClose = useAddSong((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const onSelect = (id: string) => {
    router.push(`/songs/${id}`);
    onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Add song to J...`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="songs">
          {songs?.map((song) => (
            <CommandItem
              key={song._id}
              value={`${song._id}-${song.url}`}
              title={song.url}
              onSelect={() => onSelect(song._id)}
            >
              <span>{song.url}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
