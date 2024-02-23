"use client";
import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaHome,
  FaUser,
  FaFileMedicalAlt,
  FaFilePdf,
} from "react-icons/fa";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";
import Link from "next/link";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { GiHospitalCross } from "react-icons/gi";

export default function SideBar() {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isDropdownOpenSecretary, setDropdownOpenSecretary] = useState(false);
  const currentPath = usePathname();
  const { session, status } = useCustomSession();
  //   useEffect(() => {
  //     if (
  //       status === "unauthenticated" &&
  //       currentPath !== "/restablecer-contrase%C3%B1a" &&
  //       currentPath !== "/nueva-contrase%C3%B1a"
  //     ) {
  //       router.push("/iniciar-sesion");
  //     }
  //   }, [session, router, currentPath]);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full">
        <div className="px-3 py-2 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={toggleSidebar}
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
              >
                <span className="sr-only">Abrir sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* {session && ( */}
      <aside
        id="logo-sidebar"
        className={`fixed left-0 z-1000 sm:w-64 h-screen pt-2 transition-transform duration-300 ease-in-out border-r border-gray-200 sm:translate-x-0 bg-slate-700 ${
          isSidebarOpen ? "translate-x-0 z-1000" : "-translate-x-full z-1000"
        }`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                className="flex items-center p-2 text-white rounded-lg hover:bg-gray-800  group cursor-pointer"
                href="/inicio"
              >
                <FaHome size={25} color="#0d9488" />{" "}
                <span className="flex-1 ml-3 whitespace-nowrap">
                  My Profile
                </span>
              </Link>
            </li>
            <li>
              <a
                className="flex items-center p-2 bg-slate-700 text-white rounded-lg hover:bg-gray-100  group cursor-pointer"
                onClick={() => router.push("/mi-perfil")}
              >
                <FaUser size={25} color="#0d9488" />
                <span className="flex-1 ml-3 whitespace-nowrap">
                  My Profile
                </span>
              </a>
            </li>

            <>
              {/* {isPatient && ( */}
              <li>
                <Link
                  href="/mis-laboratorios"
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group cursor-pointer"
                >
                  <FaFileMedicalAlt size={25} color="#0d9488" />
                  <span className="ml-3">Mis Laboratorios</span>
                </Link>
              </li>
              {/* )} */}
            </>

            {/* {isSecretary && ( */}
            <>
              <li className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase">
                Users Management
              </li>
              <li className="pl-5">
                <Link
                  href="/usuarios/pacientes"
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group cursor-pointer"
                >
                  <FaUsers size={25} color="#0d9488" />
                  <span className="ml-3">Patients</span>
                </Link>
              </li>
              <li className="pl-5">
                <Link
                  href="/usuarios/medicos"
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group cursor-pointer"
                >
                  <FaUserDoctor size={25} color="#0d9488" />
                  <span className="ml-3">Doctors</span>
                </Link>
              </li>
              <li className="pl-5">
                <Link
                  href="/especialidades"
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group cursor-pointer"
                >
                  <GiHospitalCross size={25} color="#0d9488" />
                  <span className="ml-3">Especialidades</span>
                </Link>
              </li>
              <li className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase">
                Reports
              </li>
              <li className="pl-5">
                <Link
                  href="/especialidades"
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group cursor-pointer"
                >
                  <FaFilePdf size={25} color="#0d9488" />
                  <span className="ml-3">Studies</span>
                </Link>
              </li>
            </>
            {/* )} */}

            {/* {isDoctor && !isSecretary && ( */}
            <>
              <li className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase">
                Users
              </li>
              <li className="pl-5">
                <Link
                  href="/usuarios/pacientes"
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group cursor-pointer"
                >
                  <FaUsers size={25} color="#0d9488" />
                  <span className="ml-3">Patients</span>
                </Link>
              </li>
            </>
            {/* )} */}

            <hr />
            <li>
              <a
                onClick={() => {
                  signOut();
                }}
                className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-red-100  group cursor-pointer"
              >
                <FiLogOut size={25} />
                <span className="flex-1 ml-3 whitespace-nowrap">Log Out</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
      {/* )} */}
    </>
  );
}
