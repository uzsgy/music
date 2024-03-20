"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";

import { Logo } from "./logo";
import { AddSongModal } from "@/components/modals/add-song-modal";
import { ArchivesModal } from "@/app/(marketing)/_components/archives/archives-modal";
import { AlbumModal } from "@/app/(marketing)/_components/albums/album-modal";

export const Navbar = () => {
  const scrolled = useScrollTop();

  return (
    <div
      className={cn(
        "z-50 bg-background/10 dark:bg-[#1F1F1F]/10 fixed top-0 flex items-center w-full px-6 py-3",
        scrolled && "border-b shadow-sm border-background/20 dark:border-[#1F1F1F]/20"
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        <AddSongModal />
        <AlbumModal />
        <ArchivesModal />
        <ModeToggle />
      </div>
    </div>
  );
};
