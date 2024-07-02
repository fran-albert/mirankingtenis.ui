"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MenubarDemo } from "./menubar";

export function NavBar() {
  return (
    <div className="flex items-center justify-between h-16 px-4 bg-slate-700 ">
      <div>
        <Link className="flex items-center" href="#">
          <Image
            width={171}
            height={172}
            src="https://mirankingtenis.com.ar/wp-content/uploads/2023/05/cropped-cropped-LOGOTENIS-171x172.png"
            alt="Your Company"
            className="h-10 w-auto"
          />
          <span className="ml-2 text-lg font-semibold text-gray-300 ">
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
        <button className="text-black">
          {/* <MenuIcon className="w-6 h-6" /> */}
        </button>
      </div>
    </div>
  );
}
