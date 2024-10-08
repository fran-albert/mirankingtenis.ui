import { createApiFixtureRepository } from "@/modules/fixture/infra/ApiFixtureRepository";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function FixtureTabs({
  onSelectJornada,
  jornadas,
  selectedJornada,
}: {
  onSelectJornada: (jornada: number) => void;
  jornadas: number[];
  selectedJornada: number;
}) {
  const [activeJornada, setActiveJornada] = useState(selectedJornada);
  useEffect(() => {
    setActiveJornada(selectedJornada);
  }, [selectedJornada]);

  const handleSelectJornada = (jornada: number) => {
    setActiveJornada(jornada);
    onSelectJornada(jornada);
  };
  return (
    <div className="flex items-center justify-center py-2 px-4 bg-white rounded-lg shadow-md ">
      <button className="mr-2 hover:bg-gray-200 rounded-full p-1">
        <FaArrowLeft className="h-6 w-6 text-gray-800" />
      </button>

      <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
        {jornadas.map((jornada) => (
          <span
            key={jornada}
            className={`whitespace-nowrap py-1 px-4 font-semibold ${
              jornada === activeJornada
                ? "bg-slate-700 text-white"
                : "hover:bg-slate-100"
            } rounded-full cursor-pointer transition-colors duration-200 ease-in-out`}
            onClick={() => handleSelectJornada(jornada)}
          >
            Fecha {jornada}
          </span>
        ))}
      </div>

      <button className="ml-2 hover:bg-gray-200 rounded-full p-1">
        <FaArrowRight className="h-6 w-6 text-gray-800" />
      </button>
    </div>
  );
}
export default FixtureTabs;
