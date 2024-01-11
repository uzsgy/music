"use client";

import { useMutation } from "convex/react";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Logo } from "./logo";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { api } from "@/convex/_generated/api";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

export const Navbar = () => {
  const create = useMutation(api.songs.create);
  const urlRef = useRef<HTMLInputElement>(null);
  const scrolled = useScrollTop();

  const convertDurationToSeconds = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)!;

    const hours = parseInt(match[1], 10) || 0;
    const minutes = parseInt(match[2], 10) || 0;
    const seconds = parseInt(match[3], 10) || 0;

    return hours * 3600 + minutes * 60 + seconds;
  };

  const onCreate = async () => {
    if (!urlRef?.current || !urlRef.current.value) return;
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${urlRef.current.value}&key=AIzaSyAoNwBgrexewOZlueo0ub4aneTzRaomrT0`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      if (data.items.length > 0) {
        const title = data.items[0].snippet.title;
        const duration = data.items[0].contentDetails.duration;
        const promise = create({
          title,
          url: `https://www.youtube.com/embed/${urlRef.current.value}`,
          duration: convertDurationToSeconds(duration),
        }).then(() => {
          if (!urlRef?.current) return;
          urlRef.current.value = "";
        });

        toast.promise(promise, {
          loading: "Queue a new song...",
          success: "New song queued!",
          error: "Failed to queue a new song.",
        });
      } else {
        console.error("Video not found");
      }
    } catch (error) {
      console.error("Error fetching YouTube video information:", error);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onCreate();
    }
  };

  return (
    <div
      className={cn(
        "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        <div className="flex items-center gap-5">
          <Input
            ref={urlRef}
            onKeyDown={onKeyDown}
            className="h-10 px-2 w-96 focus-visible:ring-transparent"
          />
          <Button onClick={onCreate} className="mr-4">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        <ModeToggle />
      </div>
    </div>
  );
};
