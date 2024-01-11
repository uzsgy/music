"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { ConvexHttpClient } from "convex/browser";

import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

const WorkerPage = () => {
  const update = useMutation(api.songs.update);
  const client = new ConvexHttpClient(process.env["NEXT_PUBLIC_CONVEX_URL"]!);

  const woker = async () => {
    setInterval(async () => {
      const songs = await client.query(api.songs.getSongs);
      if (!songs || !songs.length) return;
      const song = songs[0];
      const process = songs[0].process;
      console.log(process);
      await update({
        id: song._id,
        process: process + 1,
      });
      if (process + 1 >= song.duration) {
        await update({
          id: song._id,
          isArchived: true,
        });
      }
    }, 1000);
  };

  useEffect(() => {
    woker();
  }, []);

  return (
    <div className="mt-4 w-full flex h-full items-center justify-center">
      <p className={cn("block text-sm font-medium text-muted-foreground/80")}>
        Worker running
      </p>
    </div>
  );
};

export default WorkerPage;
