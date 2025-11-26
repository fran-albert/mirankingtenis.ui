import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useRoles from "@/hooks/useRoles";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { GiHospitalCross } from "react-icons/gi";
import { GiTennisCourt } from "react-icons/gi";
import { useRouter, usePathname } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";
import { MdAdminPanelSettings, MdHealthAndSafety } from "react-icons/md";
import {
  FaUsers,
  FaHome,
  FaUser,
  FaFileMedicalAlt,
  FaFilePdf,
  FaHeadset,
} from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { FaCalendarAlt, FaCog } from "react-icons/fa";
import { IoMdTennisball } from "react-icons/io";
import { GiTrophyCup } from "react-icons/gi";

function SideBarV3() {
  const { isAdmin } = useRoles();
  const { session, status } = useCustomSession();
  return (
    <>
      <div className="hidden border-r bg-gray-100/40 lg:block ">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="#">
              <MdAdminPanelSettings className="h-6 w-6" color="#334155" />
              <span className="">Admin Dashboard</span>
            </Link>
          </div>
          {session && (
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-4 text-sm font-medium list-none">
                <li>
                  <Link
                    href="/admin/inicio"
                    className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-200 group cursor-pointer"
                  >
                    <FaHome size={25} color="#334155" />
                    <span className="ml-3">Inicio</span>
                  </Link>
                </li>

                {isAdmin && (
                  <>
                    <li className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase">
                      Gestionar
                    </li>
                    <li className="pl-5">
                      <Link
                        href="/admin/canchas"
                        className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-200 group cursor-pointer"
                      >
                        <GiTennisCourt size={25} color="#334155" />
                        <span className="ml-3">Canchas</span>
                      </Link>
                    </li>
                    <li className="pl-5">
                      <Link
                        href="/admin/categorias"
                        className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-200 group cursor-pointer"
                      >
                        <BiSolidCategory size={25} color="#334155" />
                        <span className="ml-3">Categorías</span>
                      </Link>
                    </li>
                    <li className="pl-5">
                      <Link
                        href="/admin/jugadores"
                        className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-200 group cursor-pointer"
                      >
                        <FaUsers size={25} color="#334155" />
                        <span className="ml-3">Jugadores</span>
                      </Link>
                    </li>
                    {/* <li className="pl-5">
                      <Link
                        href="/admin/partidos"
                        className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-200 group cursor-pointer"
                      >
                        <IoMdTennisball size={25} color="#334155" />
                        <span className="ml-3">Partidos</span>
                      </Link>
                    </li> */}
                    <li className="pl-5">
                      <Link
                        href="/admin/torneos"
                        className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-200 group cursor-pointer"
                      >
                        <GiTrophyCup size={25} color="#334155" />
                        <span className="ml-3">Torneos</span>
                      </Link>
                    </li>
                    <li className="pl-5">
                      <Link
                        href="/admin/configuracion"
                        className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-200 group cursor-pointer"
                      >
                        <FaCog size={25} color="#334155" />
                        <span className="ml-3">Configuracion</span>
                      </Link>
                    </li>
                    {/* <li className="pl-5">
                      <Link
                        href="/admin/turnos"
                        className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-200 group cursor-pointer"
                      >
                        <FaCalendarAlt size={25} color="#334155" />
                        <span className="ml-3">Turnos</span>
                      </Link>
                    </li> */}
                  </>
                )}
                <hr />
                <li>
                  <Link
                    href="/master"
                    className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-red-100  group cursor-pointer mt-2"
                  >
                    <FiLogOut size={25} />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Volver
                    </span>
                  </Link>
                </li>
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SideBarV3;
