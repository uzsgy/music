import { useCallback, useRef } from "react";
import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export const AddSong = () => {
  const urlRef = useRef<HTMLInputElement>(null);
  const create = useMutation(api.songs.create);

  const convertDurationToSeconds = useCallback((duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)!;

    const hours = parseInt(match[1], 10) || 0;
    const minutes = parseInt(match[2], 10) || 0;
    const seconds = parseInt(match[3], 10) || 0;

    return hours * 3600 + minutes * 60 + seconds;
  }, []);

  const extractVideoIdFromUrl = useCallback((url: string) => {
    const regex = /[?&]v=([^?&]+)/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
  }, []);

  const onCreate = useCallback(async () => {
    if (!urlRef?.current || !urlRef.current.value) return;
    try {
      const videoId = extractVideoIdFromUrl(urlRef.current.value);
      if(!videoId) return;

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=AIzaSyAoNwBgrexewOZlueo0ub4aneTzRaomrT0`
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
          objectId: videoId,
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
        toast.error("Video not found");
      }
    } catch (error) {
      console.error("Error fetching YouTube video information:", error);
    }
  }, [urlRef, create, extractVideoIdFromUrl, convertDurationToSeconds]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        onCreate();
      }
    },
    [onCreate]
  );

  return (
    <div className="flex items-center">
      <Input
        ref={urlRef}
        onKeyDown={onKeyDown}
        placeholder="Paste Youtube link or Spotify link to add a new song."
        className="h-10 px-2 focus-visible:ring-transparent rounded-tr-none rounded-br-none"
      />
      <Button onClick={onCreate} className="rounded-tl-none rounded-bl-none">
        <PlusCircle className="h-4 w-4" />
      </Button>
    </div>
  );
};
