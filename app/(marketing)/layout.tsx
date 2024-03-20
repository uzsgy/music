import Image from "next/image";
import { Navbar } from "./_components/navbar";

const MarketingLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="min-h-full bg-[url('/logo.jpg')] bg-cover bg-center">
      <Navbar />
      <main className="h-full pt-40">
        {children}
      </main>
    </div>
  );
}

export default MarketingLayout;