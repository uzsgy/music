import Image from "next/image";

export const Logo = () => {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <div className="w-14 h-14 overflow-hidden rounded-full">
        <Image
          src="/logo.jpg"
          height="60"
          width="60"
          alt="Logo"
          objectFit="cover"
        />
      </div>
    </div>
  );
};
