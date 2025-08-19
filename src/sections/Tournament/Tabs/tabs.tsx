import { useAllTournaments } from "@/hooks/Tournament/useTournament";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function TournamentTabs({
  onSelectTournament,
}: {
  onSelectTournament: (idTournament: number) => void;
}) {
  // Usar React Query hook para torneos
  const { tournaments } = useAllTournaments();
  
  // Estado local para el torneo activo
  const [activeTournament, setActiveTournament] = useState<number>(0);
  
  // Inicializar con el primer torneo league cuando se cargan los datos
  useEffect(() => {
    if (tournaments.length > 0 && activeTournament === 0) {
      const firstLeagueTournament = tournaments.find(t => t.type === "league");
      if (firstLeagueTournament) {
        setActiveTournament(firstLeagueTournament.id);
      }
    }
  }, [tournaments, activeTournament]);

  const handleSelectTournament = (idTournament: number) => {
    setActiveTournament(idTournament);
    onSelectTournament(idTournament);
  };

  const leagueTournaments = tournaments.filter(tournament => tournament.type === "league");
  
  const scrollLeft = () => {
    const currentIndex = leagueTournaments.findIndex(t => t.id === activeTournament);
    const prevIndex = Math.max(0, currentIndex - 1);
    const prevTournament = leagueTournaments[prevIndex];
    if (prevTournament) {
      setActiveTournament(prevTournament.id);
      onSelectTournament(prevTournament.id);
    }
  };

  const scrollRight = () => {
    const currentIndex = leagueTournaments.findIndex(t => t.id === activeTournament);
    const nextIndex = Math.min(leagueTournaments.length - 1, currentIndex + 1);
    const nextTournament = leagueTournaments[nextIndex];
    if (nextTournament) {
      setActiveTournament(nextTournament.id);
      onSelectTournament(nextTournament.id);
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
        {leagueTournaments.map((tournament) => (
          <span
            key={tournament.id}
            className={`whitespace-nowrap py-1 px-4 font-semibold ${
              tournament.id === activeTournament
                ? "bg-slate-700 text-white"
                : "hover:bg-slate-100"
            } rounded-full cursor-pointer transition-colors duration-200 ease-in-out`}
            onClick={() => handleSelectTournament(tournament.id)}
          >
            {tournament.name}
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
