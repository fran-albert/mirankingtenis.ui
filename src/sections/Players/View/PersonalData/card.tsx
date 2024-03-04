import { User } from "@/modules/users/domain/User";
import React from "react";
import { FaEdit, FaPhoneAlt } from "react-icons/fa";
import { CiMail, CiCalendarDate } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
function PersonalData({ player }: { player: User | undefined }) {
  return (
    <div className="flex sm:mx-auto  mb-4">
      <div className="bg-white p-4 rounded-lg overflow-hidden shadow-md w-full max-w-lg">
        <div className="mb-4">
          <div className="flex justify-between items-center bg-gray-100 p-2 rounded-t-lg">
            <h3 className="text-sm font-bold text-gray-700 uppercase">
              Datos Personales
            </h3>
            <FaEdit className="w-4 h-4 text-gray-700 cursor-pointer" />
          </div>
          <ul>
            <li className="flex items-center justify-between p-2 rounded hover:bg-gray-100 mt-2">
              <div className="flex items-center">
                <FaPhoneAlt size={25} className="mr-2 text-amber-600" />
                <span className="text-sm font-medium">Teléfono</span>
              </div>
              <div className="text-xs text-gray-500">{player?.phone}</div>
            </li>
            <li className="flex items-center justify-between p-2 rounded hover:bg-gray-100 mt-2">
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
            <li className="flex items-center justify-between p-2 rounded hover:bg-gray-100">
              <div className="flex items-center">
                <FaLocationDot size={25} className="mr-2 text-red-600" />
                <span className="text-sm font-medium">Domicilio</span>
              </div>
              <div className="text-xs text-gray-500">
                {player?.city.city}, Santa Fé
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PersonalData;
