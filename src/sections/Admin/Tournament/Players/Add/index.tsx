import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User } from "@/types/User/User";
import { NonParticipantsDto } from "@/common/types/non-participants.dto";

export default function SelectPlayerTournamentComponent({
  users,
  onSelectedPlayersChange,
}: {
  users: NonParticipantsDto[];
  onSelectedPlayersChange: (selectedPlayers: User[]) => void;
}) {
  const [selectedPlayers, setSelectedPlayers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  const handlePlayerSelection = (player: any) => {
    let newSelectedPlayers;
    if (selectedPlayers.some((p) => p.id === player.id)) {
      newSelectedPlayers = selectedPlayers.filter((p) => p.id !== player.id);
    } else {
      newSelectedPlayers = [...selectedPlayers, player];
    }
    setSelectedPlayers(newSelectedPlayers);
    onSelectedPlayersChange(newSelectedPlayers);
  };

  const pageCount = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < pageCount; i++) {
      pages.push(
        <Button
          key={i}
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(i)}
          className={`transition duration-150 ease-in-out ${
            currentPage === i
              ? "bg-slate-700 text-white"
              : "bg-white text-slate-500"
          } hover:bg-slate-500 hover:text-white focus:outline-none mx-1`}
        >
          {i + 1}
        </Button>
      );
    }
    return pages;
  };

  return (
    <div className="grid md:grid-cols-[1fr_300px] gap-6 p-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">Jugadores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentItems.map((player) => (
            <div
              key={player.id}
              className={`bg-white rounded-lg shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer ${
                selectedPlayers.some((p) => p.id === player.id)
                  ? "border-4 border-green-800"
                  : ""
              }`}
              onClick={() => handlePlayerSelection(player)}
            >
              <img
                src={
                  player.photo
                    ? `https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${player.photo}.jpeg`
                    : "https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/mirankingtenis_default.png"
                }
                alt={player.name}
                width={100}
                height={100}
                className="rounded-full"
              />

              <div>
                <h3 className="font-semibold">
                  {player.lastname}, {player.name}
                </h3>
                <p className="text-gray-500">
                  {selectedPlayers.some((p) => p.id === player.id)
                    ? "Quitar"
                    : "Seleccionar"}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">{renderPageNumbers()}</div>
      </div>
      <div>
        {selectedPlayers.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-semibold mb-4">
              Jugadores seleccionados:
            </h3>
            <div className="grid gap-4">
              {selectedPlayers.map((player, index) => (
                <div key={player.id} className="flex items-center gap-4">
                  <span className="text-xl font-semibold">{index + 1}.</span>
                  <img
                    src={
                      player.photo
                        ? `https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${player.photo}.jpeg`
                        : "https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/mirankingtenis_default.png"
                    }
                    alt={player.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <h4 className="font-semibold">{player.name}</h4>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedPlayers([])}>
                Deseleccionar todos
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
