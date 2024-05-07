import { User } from "@/modules/users/domain/User";
import React from "react";
import { FaEdit, FaPhoneAlt } from "react-icons/fa";
import { CiMail, CiCalendarDate } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
function PersonalData({ player }: { player: User | undefined }) {
  const hoverClass = "hover:bg-gray-100 transition-colors duration-300";
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos Personales </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <ul>
          <li
            className={`flex items-center justify-between p-2 rounded ${hoverClass} mt-2`}
          >
            <div className="flex items-center">
              <FaPhoneAlt size={25} className="mr-2 text-amber-600" />
              <span className="text-sm font-medium">Teléfono</span>
            </div>
            <div className="text-xs text-gray-500">{player?.phone}</div>
          </li>
          <li
            className={`flex items-center justify-between p-2 rounded ${hoverClass} mt-2`}
          >
            <div className="flex items-center">
              <CiMail size={25} className="mr-2 text-blue-600" />
              <span className="text-sm font-medium">Correo Electrónico</span>
            </div>
            <div className="text-xs text-gray-500">{player?.email}</div>
          </li>
          <li className="flex items-center justify-between p-2 rounded hover:bg-gray-100 mt-2">
            <div className="flex items-center">
              <CiCalendarDate size={25} className="mr-2 text-green-600" />
              <span className="text-sm font-medium">Fecha de Nacimiento</span>
            </div>
            <div className="text-xs text-gray-500">{player?.email}</div>
          </li>
          <li
            className={`flex items-center justify-between p-2 rounded ${hoverClass} mt-2`}
          >
            <div className="flex items-center">
              <FaLocationDot size={25} className="mr-2 text-red-600" />
              <span className="text-sm font-medium">Domicilio</span>
            </div>
            <div className="text-xs text-gray-500">
              {player?.city.city}, Santa Fé
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

export default PersonalData;
