import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RegisterToMatchButton from "@/components/Button/Register-To-Match/button";
import RemovePlayerFromMatchButton from "@/components/Button/Remove-Player-From-Match/button";
import { AddPlayersToMatchButton } from "@/components/Button/Add-Players-To-Match/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import useRoles from "@/hooks/useRoles";
import { Pencil, Trash2 } from "lucide-react";
import { EditDoubleMatchDialog } from "../Edit-Shift/button";
import { useDoubleMatch } from "@/hooks/Doubles-Express/useDoubleMatch";
import { DoublesExhibitionMatchResponse } from "@/types/Double-Match/DoublesExhibitionMatch";
import { DeleteDoubleMatchDialog } from "../Delete-Match/button";

interface Player {
  category: string;
  name: string | null;
  id: number;
}

interface MatchCardProps {
  id: string;
  date: string;
  time: string;
  court: string;
  players: Player[];
  jugadoresDisponibles: { id: number; name: string; lastname: string }[];
  authenticatedUserId: number;
  isAdmin: boolean;
  onAddPlayer: (id: string) => void;
}
export default function MatchCard({
  id,
  date,
  time,
  court,
  players,
  authenticatedUserId,
  jugadoresDisponibles,
  isAdmin,
  onAddPlayer,
}: MatchCardProps) {
  const [showDialog, setShowDialog] = useState(false);
  const matchId = parseInt(id.substring(1));
  const [selectedDoubleMatch, setSelectedDoubleMatch] =
    useState<DoublesExhibitionMatchResponse | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [localPlayers, setPlayers] = useState(players);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const matchPlayers = players
    .map((player) => player.id)
    .filter((id): id is number => id !== null);
  const [jugadoresSeleccionados, setJugadoresSeleccionados] = useState<
    number[]
  >([]);
  const { doubleMatch } = useDoubleMatch({ auth: true, id: matchId });
  const isUserRegistered = matchPlayers.includes(authenticatedUserId);
  const registeredPlayersCount = localPlayers.filter(
    (player) => player.name !== null
  ).length;
  const handleJugadorChange = (index: number, value: number) => {
    setJugadoresSeleccionados((prev) => {
      const newJugadores = [...prev];
      newJugadores[index - 1] = value;
      return newJugadores;
    });
  };

  const handleOpenEditDialog = () => {
    if (doubleMatch) {
      setSelectedDoubleMatch(doubleMatch);
      setShowEditDialog(true);
    }
  };

  const handleOpenDeleteDialog = () => {
    if (doubleMatch) {
      setSelectedDoubleMatch(doubleMatch);
      setShowDeleteDialog(true);
    }
  };
  useEffect(() => {
    setPlayers(players);
  }, [players]);

  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-slate-700 text-white p-3 text-center font-bold border-b flex justify-between items-center">
          <span>PARTIDO {matchId}D</span>
          {(isAdmin || isUserRegistered) && (
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white"
                onClick={handleOpenEditDialog}
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleOpenDeleteDialog}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          )}
        </div>
        <div className="grid divide-y divide-gray-200">
          <div className="grid grid-cols-[auto,1fr]">
            <div className="p-2 font-bold border-r border-gray-200">D</div>
            <div className="p-2">{date}</div>
          </div>
          <div className="grid grid-cols-[auto,1fr]">
            <div className="p-2 font-bold border-r border-gray-200">H</div>
            <div className="p-2">{time}</div>
          </div>
          <div className="grid grid-cols-[auto,1fr]">
            <div className="p-2 font-bold border-r border-gray-200">C</div>
            <div className="p-2">{court}</div>
          </div>
          <div className="grid grid-cols-[auto,1fr]">
            <div className="p-2">Nombre y Apellido</div>
          </div>
          <div className="grid grid-cols-1 divide-y divide-gray-200">
            <div className="grid grid-cols-1 gap-2 p-2">
              {localPlayers.slice(0, 2).map((player, index) => (
                <PlayerRow
                  key={index}
                  player={player}
                  slot={index + 1}
                  matchId={matchId}
                  authenticatedUserId={authenticatedUserId}
                  isAdmin={isAdmin}
                  matchPlayers={matchPlayers}
                  setPlayers={setPlayers}
                />
              ))}
            </div>
            <div className="p-2 text-center font-bold">VS</div>
            <div className="grid grid-cols-1 gap-2 p-2">
              {localPlayers.slice(2, 4).map((player, index) => (
                <PlayerRow
                  key={index + 2}
                  player={player}
                  matchId={matchId}
                  matchPlayers={matchPlayers}
                  authenticatedUserId={authenticatedUserId}
                  isAdmin={isAdmin}
                  slot={index + 3}
                  setPlayers={setPlayers}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      {registeredPlayersCount < 4 && isUserRegistered && (
        <CardFooter className="p-4 border-t">
          <Button
            className="w-full"
            onClick={() => {
              setSelectedMatchId(matchId);
              setJugadoresSeleccionados(
                players
                  .map((p) => p.id)
                  .filter((id): id is number => id !== null)
              );
              setShowDialog(true);
            }}
          >
            Agregar Jugador
          </Button>

          {selectedMatchId && (
            <AddPlayersToMatchButton
              open={showDialog}
              matchId={selectedMatchId}
              onClose={() => setShowDialog(false)}
              jugadoresDisponibles={jugadoresDisponibles}
              jugadores={jugadoresSeleccionados}
              handleJugadorChange={handleJugadorChange}
            />
          )}
        </CardFooter>
      )}

      {registeredPlayersCount >= 4 && (
        <CardFooter className="p-4 border-t">
          <Button className="w-full bg-green-800 hover:bg-green-800 cursor-default">
            Completado
          </Button>
        </CardFooter>
      )}
      {selectedDoubleMatch && (
        <>
          <EditDoubleMatchDialog
            open={showEditDialog}
            onClose={() => setShowEditDialog(false)}
            doubleMatch={selectedDoubleMatch}
          />
          <DeleteDoubleMatchDialog
            open={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            doubleMatch={selectedDoubleMatch}
          />
        </>
      )}
    </Card>
  );
}
interface PlayerRowProps {
  player: Player;
  matchId: number;
  slot: number;
  authenticatedUserId: number;
  isAdmin: boolean;
  setPlayers: (updatedPlayers: any) => void;
  matchPlayers: number[];
}
function PlayerRow({
  player,
  matchId,
  slot,
  authenticatedUserId,
  isAdmin,
  matchPlayers,
  setPlayers,
}: PlayerRowProps) {
  const isCurrentUser = player.id === authenticatedUserId;
  const canSignOff = isAdmin || isCurrentUser;
  const isAlreadyInMatch = matchPlayers.includes(authenticatedUserId);
  const isSlotAvailable = !player.name;
  const { session } = useRoles();
  return (
    <div className="flex justify-between items-center gap-2">
      <div className="flex items-center gap-2">
        <span>{player.name || "Disponible"}</span>
      </div>

      <div>
        {player.name ? (
          canSignOff ? (
            <RemovePlayerFromMatchButton
              matchId={matchId}
              playerId={player.id}
              setPlayers={setPlayers}
            />
          ) : null
        ) : !isAlreadyInMatch && session ? (
          <RegisterToMatchButton
            matchId={matchId}
            slot={slot}
            playerId={authenticatedUserId}
            setPlayers={setPlayers}
          />
        ) : null}
      </div>
    </div>
  );
}
