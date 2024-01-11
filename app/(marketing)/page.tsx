"use client";

import { useConvexAuth } from "convex/react";
import { Footer } from "./_components/footer";
import { Heading } from "./_components/heading";
import { Heroes } from "./_components/heroes";
import { Songs } from "./_components/songs";
import { Spinner } from "@/components/spinner";

const MarketingPage = () => {
  return (
    <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
        <Songs />
      </div>
      <Footer />
    </div>
  );
};

export default MarketingPage;
