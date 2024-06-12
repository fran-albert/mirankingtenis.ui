import { useTournamentStore } from "@/hooks/useTournament";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function TournamentTabs({
  onSelectTournament,
}: {
  onSelectTournament: (idTournament: number) => void;
}) {
  const {
    getAllTournaments,
    tournaments,
    activeTournament,
    setActiveTournament,
  } = useTournamentStore();

  useEffect(() => {
    if (tournaments.length === 0) {
      getAllTournaments();
    }
  }, [getAllTournaments, tournaments.length]);

  const handleSelectTournament = (idTournament: number) => {
    setActiveTournament(idTournament);
    onSelectTournament(idTournament);
  };

  const scrollLeft = () => {
    const prevIndex = Math.max(0, activeTournament - 1);
    const prevCategory = tournaments[prevIndex];
    if (prevCategory) {
      setActiveTournament(prevCategory.id);
      onSelectTournament(prevCategory.id);
    }
  };

  const scrollRight = () => {
    const nextIndex = Math.min(tournaments.length - 1, activeTournament + 1);
    const nextCategory = tournaments[nextIndex];
    if (nextCategory) {
      setActiveTournament(nextCategory.id);
      onSelectTournament(nextCategory.id);
    }
  };
  return (
    <div className="flex items-center justify-center py-2 px-4 bg-white rounded-lg shadow-md">
      <button
        onClick={scrollLeft}
        className="mr-2 hover:bg-gray-200 rounded-full p-1"
      >
        <FaArrowLeft className="h-6 w-6 text-gray-800" />
      </button>

      <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
        {tournaments.map((category) => (
          <span
            key={category.id}
            className={`whitespace-nowrap py-1 px-4 font-semibold ${
              category.id === activeTournament
                ? "bg-slate-700 text-white"
                : "hover:bg-slate-100"
            } rounded-full cursor-pointer transition-colors duration-200 ease-in-out`}
            onClick={() => handleSelectTournament(category.id)}
          >
            {category.name}
          </span>
        ))}
      </div>

      <button
        onClick={scrollRight}
        className="ml-2 hover:bg-gray-200 rounded-full p-1"
      >
        <FaArrowRight className="h-6 w-6 text-gray-800" />
      </button>
    </div>
  );
}
export default TournamentTabs;
