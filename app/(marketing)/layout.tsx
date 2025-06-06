"use client";

import Image from "next/image";
import { Navbar } from "./_components/navbar";
import { useEffect, useState } from "react";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((prev) => (prev + 1) % 3), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className={`min-h-full bg-cover bg-center`}
      style={{ backgroundImage: "url('/x1.jpeg');" }}
    >
      <Navbar />
      <main className="h-full pt-40">{children}</main>
    </div>
  );
};

export default MarketingLayout;
