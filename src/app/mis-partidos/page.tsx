"use client";
import Loading from "@/components/Loading/loading";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { useTournamentStore } from "@/hooks/useTournament";
import { useUserStore } from "@/hooks/useUser";
import { getMatchesByUser } from "@/modules/match/application/get-by-user/getMatchesByUser";
import MatchesIndex from "@/sections/Auth/Profile/Matches";
import PlayerChart from "@/sections/Players/View/HistoryRanking/chart";
import React, { useEffect, useState } from "react";
import { TournamentSelect } from "@/components/Select/Tournament/allTournament.select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useMatchStore } from "@/hooks/useMatch";
import { useTournamentCategoryStore } from "@/hooks/useTournamentCategory";
import { BadgeWin } from "@/components/Badge/Green/badge";
import { BadgePending } from "@/components/Badge/Pending/badge";

function MyMatchesPage() {
  const { session } = useCustomSession();
  const idUser = Number(session?.user?.id);
  const isValidIdUser = !isNaN(idUser) && idUser > 0;
  const { getUser, user } = useUserStore();
  const { getAllTournamentsByPlayer } = useTournamentStore();
  const { getTournamentCategoriesByUser, categories } =
    useTournamentCategoryStore();
  const {
    loading: isLoadingMatches,
    getMatchesByUser,
    matches,
  } = useMatchStore();

  useEffect(() => {
    if (isValidIdUser) {
      getUser(idUser);
      getAllTournamentsByPlayer(idUser);
      getTournamentCategoriesByUser(idUser);
    }
  }, [
    idUser,
    getUser,
    getAllTournamentsByPlayer,
    getTournamentCategoriesByUser,
    isValidIdUser,
    getMatchesByUser,
  ]);

  const [selectedTournament, setSelectedTournament] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (isValidIdUser && selectedTournament) {
      const tournamentId = parseInt(selectedTournament);
      const selectedCategories = categories.filter(
        (tc) => tc.tournament.id === tournamentId
      );
      selectedCategories.forEach((tc) => {
        getMatchesByUser(idUser, tc.tournament.id, tc.category.id);
      });
    }
  }, [isValidIdUser, selectedTournament, categories, getMatchesByUser, idUser]);

  const handleTournamentChange = (value: string) => {
    setSelectedTournament(value);
  };

  const handleUpdateMatches = () => {
    if (isValidIdUser && selectedTournament) {
      const tournamentId = parseInt(selectedTournament);
      const selectedCategories = categories.filter(
        (tc) => tc.tournament.id === tournamentId
      );
      selectedCategories.forEach((tc) => {
        getMatchesByUser(idUser, tc.tournament.id, tc.category.id);
      });
    }
  };

  if (isLoadingMatches) {
    return <Loading isLoading />;
  }

  return (
    <div className="container mt-4">
      <div className="container space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Mis Partidos</h2>
          <p className="text-muted-foreground">
            Aquí puedes ver el historial de ranking y los próximos partidos de
            tu equipo favorito.
          </p>
        </div>
        <div className="w-full relative">
          <TournamentSelect
            selected={selectedTournament}
            onTournament={handleTournamentChange}
            userId={isValidIdUser ? idUser : undefined}
          />
        </div>
      </div>
      {!selectedTournament ? (
        <div className="mt-10 text-center text-lg font-semibold text-muted-foreground">
          Por favor selecciona un torneo para ver los partidos.
        </div>
      ) : (
        <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
          <div className="w-full max-w-7xl space-y-6">
            <PlayerChart player={user} />
            <MatchesIndex
              match={matches}
              onUpdateMatches={handleUpdateMatches}
            />
            <div className="overflow-x-auto rounded-lg overflow-hidden shadow-xl border border-gray-200">
              <Table>
                <TableHeader className="bg-slate-700">
                  <TableRow>
                    <TableHead className="py-2 px-6 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      FECHA
                    </TableHead>
                    <TableHead className="py-2 px-6 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      RIVAL
                    </TableHead>
                    <TableHead className="py-2 px-6 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      DÍA Y HORA
                    </TableHead>
                    <TableHead className="py-2 px-6 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      CANCHA
                    </TableHead>
                    <TableHead className="py-2 px-6 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      RESULTADO
                    </TableHead>
                    <TableHead className="py-2 px-6 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      ESTADO
                    </TableHead>
                    <TableHead className="py-2 px-6 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      ACCIONES
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matches.map((match, index) => (
                    <TableRow key={index}>
                      <TableCell>{match.fixture.jornada}</TableCell>
                      <TableCell>{match.rivalName}</TableCell>
                      <TableCell>
                        {formatDate(match.shift?.startHour)}
                      </TableCell>
                      <TableCell>{match.shift?.court?.name}</TableCell>
                      <TableCell>{match.result}</TableCell>
                      <TableCell>
                        {match.status === "pending" ? (
                          <span className="px-3 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"></span>
                        ) : (
                          <div className="flex items-center">
                            {match.finalResult}
                            {match.sets.map((set, index) => (
                              <div className="m-2" key={index}>
                                <span className="player-scores">
                                  {set.pointsPlayer1}
                                </span>
                                <span className="player-scores">-</span>
                                <span className="player-scores">
                                  {set.pointsPlayer2}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center">
                          {match.status === "played" ? (
                            <span className="ml-2 text-sm font-semibold ">
                              <BadgeWin text="Jugado" />
                            </span>
                          ) : (
                            <span className="ml-2 text-sm font-semibold ">
                              <BadgePending text="Pendiente" />
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Agregar resultado
                          </Button>
                          <Button variant="outline" size="sm">
                            Editar turno
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500"
                          >
                            Eliminar turno
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
      {/* <div className="px-4 py-6 md:px-6 md:py-12 lg:py-16">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Mis Partidos</h2>
          <p className="text-muted-foreground">
            Aquí puedes ver el historial de ranking y los próximos partidos de
            tu equipo favorito.
          </p>
        </div>
        <div className="w-full relative">
          <TournamentSelect
            selected={selectedTournament}
            onTournament={handleTournamentChange}
            userId={isValidIdUser ? idUser : undefined}
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
        <PlayerChart player={user} />
        <Card className="h-full w-full lg:col-span-2">
          <CardHeader>
            <CardTitle>Próximos Partidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>FECHA</TableHead>
                    <TableHead>RIVAL</TableHead>
                    <TableHead>DÍA Y HORA</TableHead>
                    <TableHead>CANCHA</TableHead>
                    <TableHead>RESULTADO</TableHead>
                    <TableHead>ESTADO</TableHead>
                    <TableHead>ACCIONES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matches.map((match, index) => (
                    <TableRow key={index}>
                      <TableCell>{match.fixture.jornada}</TableCell>
                      <TableCell>{match.rivalName}</TableCell>
                      <TableCell>{formatDate(match.shift?.startHour)}</TableCell>
                      <TableCell>{match.shift?.court?.name}</TableCell>
                      <TableCell>{match.result}</TableCell>
                      <TableCell>{match.status}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Agregar resultado
                          </Button>
                          <Button variant="outline" size="sm">
                            Editar turno
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500"
                          >
                            Eliminar turno
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div> */}
    </div>
  );
}

export default MyMatchesPage;
