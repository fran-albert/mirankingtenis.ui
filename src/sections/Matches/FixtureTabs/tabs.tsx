import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function FixtureTabs({
  onSelectJornada,
}: {
  onSelectJornada: (jornada: number) => void;
}) {
  const [activeJornada, setActiveJornada] = useState(1);

  const jornadas = [1, 2, 3, 4];

  const handleSelectJornada = (jornada: number) => {
    setActiveJornada(jornada);
    onSelectJornada(jornada);
  };
  return (
    <div className="flex items-center justify-center py-2 px-4 bg-white rounded-lg shadow">
      <button className="mr-2">
        <FaArrowLeft className="h-6 w-6 text-gray-800" />
      </button>

      <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
        {jornadas.map((jornada) => (
          <span
            key={jornada}
            className={`whitespace-nowrap py-1 px-4 ${
              jornada === activeJornada ? "bg-slate-500 text-white" : ""
            } rounded-full cursor-pointer`}
            onClick={() => handleSelectJornada(jornada)}
          >
            Fecha {jornada}
          </span>
        ))}
      </div>

      <button className="ml-2">
        <FaArrowRight className="h-6 w-6 text-gray-800" />
      </button>
    </div>
  );
}
export default FixtureTabs;
