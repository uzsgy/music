// "use client";

// import { useEffect, useState } from "react";
// import { File } from "lucide-react";
// import { useQuery } from "convex/react";
// import { useRouter } from "next/navigation";
// import { useUser } from "@clerk/clerk-react";

// import {
//   CommandDialog,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import { useSearch } from "@/hooks/use-search";
// import { api } from "@/convex/_generated/api";

// export const SearchCommand = () => {
//   const { user } = useUser();
//   const router = useRouter();
//   const posts = useQuery(api.posts.getSearch);
//   const [isMounted, setIsMounted] = useState(false);

//   const toggle = useSearch((store) => store.toggle);
//   const isOpen = useSearch((store) => store.isOpen);
//   const onClose = useSearch((store) => store.onClose);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   useEffect(() => {
//     const down = (e: KeyboardEvent) => {
//       if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault();
//         toggle();
//       }
//     };

//     document.addEventListener("keydown", down);
//     return () => document.removeEventListener("keydown", down);
//   }, [toggle]);

//   const onSelect = (id: string) => {
//     router.push(`/posts/${id}`);
//     onClose();
//   };

//   if (!isMounted) {
//     return null;
//   }

//   return (
//     <CommandDialog open={isOpen} onOpenChange={onClose}>
//       <CommandInput placeholder={`Search ${user?.fullName}'s Jotion...`} />
//       <CommandList>
//         <CommandEmpty>No results found.</CommandEmpty>
//         <CommandGroup heading="posts">
//           {posts?.map((post) => (
//             <CommandItem
//               key={post._id}
//               value={`${post._id}-${post.title}`}
//               title={post.title}
//               onSelect={() => onSelect(post._id)}
//             >
//               {post.icon ? (
//                 <p className="mr-2 text-[18px]">{post.icon}</p>
//               ) : (
//                 <File className="mr-2 h-4 w-4" />
//               )}
//               <span>{post.title}</span>
//             </CommandItem>
//           ))}
//         </CommandGroup>
//       </CommandList>
//     </CommandDialog>
//   );
// };
