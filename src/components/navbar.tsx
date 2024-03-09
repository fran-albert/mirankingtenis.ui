"use client";
import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { FaBell } from "react-icons/fa";
import { FaGripLines } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { usePathname, useRouter } from "next/navigation";
import useRoles from "@/hooks/useRoles";
import Image from "next/image";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { session } = useCustomSession();
  const { isAdmin } = useRoles();
  const pathname = usePathname();

  const [navigation, setNavigation] = useState([
    { name: "Jugadores", href: "/jugadores", current: false },
    { name: "Ranking", href: "/ranking", current: false },
    { name: "Partidos", href: "/partidos", current: false },
    // { name: "Turnos", href: "/turnos", current: false },
  ]);

  useEffect(() => {
    const baseNavigation = [
      { name: "Jugadores", href: "/jugadores", current: false },
      { name: "Ranking", href: "/ranking", current: false },
      { name: "Partidos", href: "/partidos", current: false },
    ];

    if (session) {
      baseNavigation.push({
        name: "Mis Partidos",
        href: "/mis-partidos",
        current: false,
      });
    }

    const updatedNavigation = [
      ...baseNavigation,
      ...(isAdmin
        ? [{ name: "Fixture", href: "/fixture", current: false }]
        : []),
    ].map((item) => ({
      ...item,
      current: pathname === item.href,
    }));

    setNavigation(updatedNavigation);
  }, [pathname, isAdmin, session]); // Asegúrate de incluir 'session' en la lista de dependencias

  return (
    <Disclosure as="nav" className="bg-slate-700">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <IoClose className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <FaGripLines className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="https://www.mirankingtenis.com.ar">
                    <Image
                      width={171}
                      height={172}
                      src="https://mirankingtenis.com.ar/wp-content/uploads/2023/05/cropped-cropped-LOGOTENIS-171x172.png"
                      alt="Your Company"
                      className="h-10 w-auto"
                    />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-slate-900 text-white"
                            : "text-gray-300 hover:bg-slate-900 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {session ? (
                  <>
                    <button
                      type="button"
                      className="relative rounded-full bg-slate-700 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <FaBell className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex rounded-full bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <Image
                            className="h-8 w-8 rounded-full"
                            src={
                              session?.user?.photo
                                ? `https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${session.user.photo}.jpeg`
                                : "https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/default2.png"
                            }
                            alt="User profile"
                            height={32}
                            width={32}
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
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href="/mi-perfil"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Mi Perfil
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Ajustes
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                onClick={() => {
                                  signOut({
                                    callbackUrl:
                                      process.env.NEXT_PUBLIC_BASE_URL,
                                  });
                                }}
                                className={classNames(
                                  active ? "bg-red-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                                )}
                              >
                                Cerrar Sesión
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </>
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

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
