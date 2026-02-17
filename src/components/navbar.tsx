"use client";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { FaGripLines } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { useAuth } from "@/context/AuthProvider";
import { usePathname } from "next/navigation";
import useRoles from "@/hooks/useRoles";
import Image from "next/image";
import { OptimizedAvatar } from "@/components/ui/optimized-avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
}

const directLinks: NavItem[] = [
  { name: "Jugadores", href: "/jugadores" },
  { name: "Ranking", href: "/ranking" },
  { name: "Turnos", href: "/turnos" },
];

const competenciasItems: NavItem[] = [
  { name: "Master", href: "/master" },
  { name: "Carrera al Master", href: "/carrera-al-master" },
  { name: "Torneo Dobles", href: "/torneo-dobles" },
  { name: "Torneo Equipos", href: "/torneo-equipos" },
  { name: "Partidos", href: "/partidos" },
];

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}

function isCompetenciasActive(pathname: string): boolean {
  return competenciasItems.some((item) => isActive(pathname, item.href));
}

export default function Navbar() {
  const { session } = useCustomSession();
  const { isAdmin } = useRoles();
  const { logout } = useAuth();
  const pathname = usePathname();

  return (
    <Disclosure as="nav" className="bg-slate-700">
      {({ open, close }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Hamburger mobile */}
              <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Abrir menú</span>
                  {open ? (
                    <IoClose className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <FaGripLines className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              {/* Logo + Desktop nav */}
              <div className="flex flex-1 items-center justify-center lg:items-stretch lg:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/master">
                    <Image
                      width={171}
                      height={172}
                      src="/LOGOTENIS.png"
                      alt="Mi Ranking Tenis"
                      className="h-10 w-auto"
                    />
                  </Link>
                </div>

                {/* Desktop navigation */}
                <div className="hidden lg:ml-6 lg:flex lg:items-center lg:gap-1">
                  {/* Competencias dropdown (primero) */}
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger
                          className={cn(
                            "h-auto rounded-md px-3 py-2 text-sm font-medium",
                            "bg-transparent border-none",
                            "hover:bg-slate-900 hover:text-white",
                            "focus:bg-slate-900 focus:text-white",
                            "data-[state=open]:bg-slate-900 data-[state=open]:text-white",
                            "data-[state=open]:hover:bg-slate-900 data-[state=open]:hover:text-white",
                            "data-[state=open]:focus:bg-slate-900 data-[state=open]:focus:text-white",
                            isCompetenciasActive(pathname)
                              ? "bg-slate-900 text-white"
                              : "text-gray-300"
                          )}
                        >
                          Competencias
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="w-48 p-2">
                            {competenciasItems.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={cn(
                                    "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive(pathname, item.href)
                                      ? "bg-slate-100 text-slate-900 font-semibold"
                                      : "text-slate-700 hover:bg-slate-100"
                                  )}
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>

                  {/* Direct links */}
                  {directLinks.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm font-medium",
                        isActive(pathname, item.href)
                          ? "bg-slate-900 text-white"
                          : "text-gray-300 hover:bg-slate-900 hover:text-white"
                      )}
                      aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {/* Mis Partidos (auth only) */}
                  {session && (
                    <Link
                      href="/mis-partidos"
                      className={cn(
                        "rounded-md px-3 py-2 text-sm font-medium",
                        isActive(pathname, "/mis-partidos")
                          ? "bg-slate-900 text-white"
                          : "text-gray-300 hover:bg-slate-900 hover:text-white"
                      )}
                      aria-current={isActive(pathname, "/mis-partidos") ? "page" : undefined}
                    >
                      Mis Partidos
                    </Link>
                  )}
                </div>
              </div>

              {/* Right side: avatar / login */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 lg:static lg:inset-auto lg:ml-6 lg:pr-0">
                {session ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Abrir menú de usuario</span>
                        <OptimizedAvatar
                          src={session?.user?.photo}
                          alt={`${session?.user?.name} ${session?.user?.lastname}`}
                          size="thumbnail"
                          className="h-8 w-8"
                          fallbackText={`${session?.user?.name?.[0] || ""}${session?.user?.lastname?.[0] || ""}`}
                          showFallback={true}
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/mi-perfil"
                              className={cn(
                                "block px-4 py-2 text-sm text-gray-700",
                                active && "bg-gray-100"
                              )}
                            >
                              Mi Perfil
                            </Link>
                          )}
                        </Menu.Item>
                        {isAdmin && (
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href="/admin/inicio"
                                className={cn(
                                  "block px-4 py-2 text-sm text-gray-700",
                                  active && "bg-gray-100"
                                )}
                              >
                                Admin
                              </Link>
                            )}
                          </Menu.Item>
                        )}
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              onClick={() => {
                                logout();
                                window.location.href = "/";
                              }}
                              className={cn(
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer",
                                active && "bg-red-100"
                              )}
                            >
                              Cerrar Sesión
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <Link
                    className="text-gray-300 hover:bg-slate-900 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    href="/iniciar-sesion"
                  >
                    Iniciar Sesión
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="lg:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {/* Competencias group (primero) */}
              <div className="pb-1">
                <p className="px-3 text-xs font-semibold uppercase text-gray-500">
                  Competencias
                </p>
              </div>
              {competenciasItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => close()}
                  className={cn(
                    "block rounded-md px-3 py-2 pl-6 text-base font-medium",
                    isActive(pathname, item.href)
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}

              {/* Direct links */}
              <div className="pt-2 pb-1">
                <hr className="border-gray-600" />
              </div>
              {directLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => close()}
                  className={cn(
                    "block rounded-md px-3 py-2 text-base font-medium",
                    isActive(pathname, item.href)
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}

              {/* Auth-only items */}
              {session && (
                <Link
                  href="/mis-partidos"
                  onClick={() => close()}
                  className={cn(
                    "block rounded-md px-3 py-2 text-base font-medium",
                    isActive(pathname, "/mis-partidos")
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )}
                  aria-current={isActive(pathname, "/mis-partidos") ? "page" : undefined}
                >
                  Mis Partidos
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin/inicio"
                  onClick={() => close()}
                  className={cn(
                    "block rounded-md px-3 py-2 text-base font-medium",
                    isActive(pathname, "/admin")
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )}
                >
                  Admin
                </Link>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
