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
import { Copy, Pause, Play, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AddToAlbum } from "./add-to-album";
import { Button } from "@/components/ui/button";
import { PasswordModal } from "@/components/modals/password-modal";

interface ArchiveProps {
  songs: Doc<"songs">[];
}

export const CurrentlyPlayingSong: React.FC<ArchiveProps> = ({ songs }) => {
  const addToListById = useMutation(api.songs.addToListById);
  const archive = useMutation(api.songs.archive);
  const update = useMutation(api.songs.update);
  const updateTime = useMutation(api.songs.updateTime);
  const [password, setPassword] = useState('');

  const [currentSong, setCurrentSong] = useState<Doc<"songs"> | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const onAddToListById = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: Id<"songs">
  ) => {
    event.stopPropagation();
    if (!id) return;
    const promise = addToListById({ id });

    toast.promise(promise, {
      loading: "Song added to tracks...",
      success: "song moved to tracks!",
      error: "Failed to add song.",
    });
  };

  const onArchive = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: Id<"songs">
  ) => {
    event.stopPropagation();
    if (!id) return;
    const promise = archive({ id });

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Song moved to trash!",
      error: "Failed to archive song.",
    });
  };

  const process = useMemo(() => {
    return Math.round(
      (Date.now() - parseInt(currentSong?.startTime || "0")) / 1000
    );
  }, [currentSong]);

  useEffect(() => {
    if (!songs || !songs.length) return;

    if (isPaused) {
      setCurrentSong(null);
      return;
    }

    const song = songs.filter((s) => !s.isArchived)?.[0];
    if (!song || song._id === currentSong?._id) return;

    setCurrentSong(song);
    updateTime({ id: song._id, startTime: Date.now().toString() });
    const timeInterval = setInterval(() => {
      if (Date.now() < song.duration * 1000 + parseInt(song.startTime || "0")) {
        return;
      }

      update({
        id: song._id,
        isArchived: true,
      });
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [songs, isPaused]);

  // if (password !== 'jd3t2') return <PasswordModal password={password} setPassword={setPassword} />;

  return (
    <div className="mt-4 w-full">
      <div className="text-left mb-10 font-bold flex items-center gap-2">
        Playing Songs
        {isPaused ? (
          <Button onClick={() => setIsPaused(false)} variant="ghost" size="sm">
            <Play className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={() => setIsPaused(true)} variant="ghost" size="sm">
            <Pause className="w-4 h-4" />
          </Button>
        )}
      </div>
      <iframe
        className="hidden"
        width="560"
        height="315"
        src={`${`https://www.youtube.com/embed/${currentSong?.objectId}`}?start=${process}&autoplay=1&v=${currentSong?._id
          }`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Title</TableHead>
            <TableHead className="text-right w-20">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs.map((song: Doc<"songs">) => (
            <TableRow key={song._id}>
              <TableCell className="text-left">{song.title}</TableCell>
              <TableCell className="flex justify-end">
                <AddToAlbum song={song} />
                <Button
                  onClick={(e) => onAddToListById(e, song._id)}
                  size="sm"
                  variant="ghost"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  onClick={(e) => onArchive(e, song._id)}
                  size="sm"
                  variant="ghost"
                >
                  <Trash className="h-4 w-4 cursor-pointer text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
