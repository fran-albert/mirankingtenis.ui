import React from "react";
import { FaHandPaper, FaWeight } from "react-icons/fa";
import { GiWeightLiftingUp } from "react-icons/gi";
import { IoIosBody } from "react-icons/io";
import { MdHeight, MdOutlineSportsTennis } from "react-icons/md";

function DetailsPlayer() {
  return (
    <div className="flex sm:mx-auto mb-4">
      <div className="bg-white p-4 rounded-lg overflow-hidden shadow-md w-full max-w-lg">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase mb-2 bg-gray-100 p-2">
            Detalles
          </h3>
          <ul>
            <li className="flex items-center justify-between p-2 rounded hover:bg-gray-100">
              <div className="flex items-center">
                <MdHeight className="w-4 h-4 mr-2 text-red-600" />
                <span className="text-sm font-medium">Altura</span>
              </div>
              <div className="text-xs text-gray-500">1,80 m</div>
            </li>
            <li className="flex items-center justify-between p-2 rounded hover:bg-gray-100 mt-2">
              <div className="flex items-center">
                <FaWeight className="w-4 h-4 mr-2 text-amber-600" />{" "}
                <span className="text-sm font-medium">Peso</span>
              </div>
              <div className="text-xs text-gray-500">80 kg</div>
            </li>
            <li className="flex items-center justify-between p-2 rounded hover:bg-gray-100 mt-2">
              <div className="flex items-center">
                <FaHandPaper className="w-4 h-4 mr-2 text-green-600" />{" "}
                {/* Reemplaza con tu ícono de imagen */}
                <span className="text-sm font-medium">Mano</span>
              </div>
              <div className="text-xs text-gray-500">Derecha</div>
            </li>
            <li className="flex items-center justify-between p-2 rounded hover:bg-gray-100 mt-2">
              <div className="flex items-center">
                <MdOutlineSportsTennis className="w-4 h-4 mr-2 text-sky-600" />{" "}
                {/* Reemplaza con tu ícono de imagen */}
                <span className="text-sm font-medium">Revés</span>
              </div>
              <div className="text-xs text-gray-500">Dos manos</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DetailsPlayer;
