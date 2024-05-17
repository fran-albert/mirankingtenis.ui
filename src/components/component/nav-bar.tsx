"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { MenubarDemo } from "./menubar";

export function NavBar() {
  return (
    <div className="flex items-center justify-between h-16 px-4 bg-slate-700 dark:bg-gray-800">
      <div>
        <Link className="flex items-center" href="#">
          <Image
            width={171}
            height={172}
            src="https://mirankingtenis.com.ar/wp-content/uploads/2023/05/cropped-cropped-LOGOTENIS-171x172.png"
            alt="Your Company"
            className="h-10 w-auto"
          />
          <span className="ml-2 text-lg font-semibold text-gray-300 dark:text-white">
            Mi Ranking Tenis
          </span>
        </Link>
      </div>
      <nav className="lg:flex hidden space-x-4">
        <MenubarDemo />
      </nav>
      <div className="lg:flex hidden items-center space-x-4">
        <Button className="text-sm" variant="outline">
          Login
        </Button>
        <Button className="text-sm">Register</Button>
      </div>
      <div className="lg:hidden flex items-center">
        <button className="text-black dark:text-white">
          {/* <MenuIcon className="w-6 h-6" /> */}
        </button>
      </div>
    </div>
  );
}

// function MenuIcon(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <line x1="4" x2="20" y1="12" y2="12" />
//       <line x1="4" x2="20" y1="6" y2="6" />
//       <line x1="4" x2="20" y1="18" y2="18" />
//     </svg>
//   );
// }
