"use client";

import { useConvexAuth } from "convex/react";

export const Heading = () => {
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Music. Welcome to <span className="underline">J</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        J is the connected workspace where <br />
        better, faster work happens.
      </h3>
    </div>
  )
}