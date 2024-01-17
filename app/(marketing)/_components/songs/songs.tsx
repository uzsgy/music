"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

import { CurrentlyPlayingSong } from "./currently-playing-song";
import { AddSong } from "@/components/add-song";

export const Songs = () => {
  const songs = useQuery(api.songs.getPlayingSongs);

  if (!songs) return null;

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          <AddSong />
        </div>
      </div>
      <CurrentlyPlayingSong songs={songs} />
    </div>
  );
};
