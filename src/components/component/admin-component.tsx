"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MdAdminPanelSettings } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import { FaHome, FaUsers, FaCog } from "react-icons/fa";
import { GiTennisCourt, GiTrophyCup } from "react-icons/gi";
import { BiSolidCategory } from "react-icons/bi";
import { IoMdTennisball } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "@/context/AuthProvider";
import SideBarV3 from "./sideBarV2";

const menuItems = [
  { href: "/admin/inicio", label: "Inicio", icon: FaHome },
  { href: "/admin/canchas", label: "Canchas", icon: GiTennisCourt },
  { href: "/admin/categorias", label: "Categorias", icon: BiSolidCategory },
  { href: "/admin/jugadores", label: "Jugadores", icon: FaUsers },
  { href: "/admin/torneos", label: "Torneos", icon: GiTrophyCup },
  { href: "/admin/torneo-dobles", label: "Torneo Dobles", icon: IoMdTennisball },
  { href: "/admin/configuracion", label: "Configuracion", icon: FaCog },
];

export function AdminComponent({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <SideBarV3 />
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-3 sm:px-6">
          <div className="flex items-center lg:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  className="rounded-full border border-gray-200 w-10 h-10"
                  size="icon"
                  variant="ghost"
                >
                  <IoMenu size={25} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <SheetHeader className="flex h-[60px] items-center border-b px-6">
                  <SheetTitle className="flex items-center gap-2 font-semibold">
                    <MdAdminPanelSettings className="h-6 w-6" color="#334155" />
                    Admin Dashboard
                  </SheetTitle>
                </SheetHeader>
                <nav className="grid items-start px-4 py-4 text-sm font-medium list-none">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSheetOpen(false)}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-gray-200 font-semibold text-gray-900"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon size={22} color="#334155" />
                        {item.label}
                      </Link>
                    );
                  })}
                  <hr className="my-2" />
                  <Link
                    href="/master"
                    onClick={() => setSheetOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-red-50"
                  >
                    <FiLogOut size={22} />
                    Volver
                  </Link>
                  <button
                    onClick={() => {
                      setSheetOpen(false);
                      logout();
                      window.location.href = "/";
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <FiLogOut size={22} />
                    Cerrar Sesion
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex-1">
            <h1 className="text-sm sm:text-lg font-semibold md:text-xl">
              Panel de Control - Mi Ranking Tenis
            </h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 px-2 sm:px-4 md:px-6 py-4 sm:py-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
