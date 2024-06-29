import { Match } from "@/modules/match/domain/Match";
import { User } from "@/modules/users/domain/User";
import React from "react";
import { FaEdit, FaPlus } from "react-icons/fa";

function MatchesDetails({ matches }: { matches: Match[] }) {
  return (
    <div className="flex sm:mx-auto">
      <div className="bg-white p-4 rounded-lg overflow-hidden shadow-md w-full max-w-lg">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase mb-2 bg-gray-100 p-2">
            Historial de Partidos
          </h3>
          <div className="space-y-4">
            <div className="p-2 rounded hover:bg-gray-100 flex justify-between items-center">
              <div>
                <p className="text-gray-800 font-semibold"> Influenza </p>
                <p className="text-gray-600 text-xs">FECHA HOY</p>
              </div>
              <button className="ml-4 text-gray-500 hover:text-gray-700">
                <FaEdit className="w-4 h-4 text-teal-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchesDetails;
