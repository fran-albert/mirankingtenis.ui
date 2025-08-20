"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MdAdminPanelSettings } from "react-icons/md";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IoMenu } from "react-icons/io5";
import { useAuth } from "@/context/AuthProvider";
import SideBarV3 from "./sideBarV2";

export function AdminComponent({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <SideBarV3 />
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6">
          <div className="flex items-center md:hidden ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="rounded-full border border-gray-200 w-8 h-8"
                  size="icon"
                  variant="ghost"
                >
                  <IoMenu size={25} />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    window.location.href = "/";
                  }}
                >
                  Logout
                </DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold md:text-xl">
              Panel de Control - Mi Ranking Tenis
            </h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 bg-gray-50">
          {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"> */}
          {children}
          {/* </div> */}
        </main>
      </div>
    </div>
  );
}
