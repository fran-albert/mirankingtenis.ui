"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayoffRound, ManualBracketMatchup } from "@/types/Tournament-Category/TournamentCategory";
import { useParticipantsByTournamentCategory } from "@/hooks/Tournament-Participant/useTournamentParticipant";
import { useTournament } from "@/hooks/Tournament/useTournaments";
import { useCategoriesForTournament } from "@/hooks/Tournament-Category/useTournamentCategories";
import { usePlayoffStageStatus } from "@/hooks/PlayOff/usePlayOff";
import { TournamentParticipant } from "@/types/Tournament-Participant/TournamentParticipant";
import { toast } from "sonner";
import { Loader2, Shuffle, User, Trophy, ArrowLeft, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useManualBracketMutation } from "@/hooks/PlayOff/useManualBracket";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreateBracketViewProps {
  tournamentId: number;
  categoryId: number;
}

const getMatchCountForRound = (round: PlayoffRound): number => {
  switch (round) {
    case "RoundOf16": return 8;
    case "QuarterFinals": return 4;
    case "SemiFinals": return 2;
    case "Finals": return 1;
    default: return 4;
  }
};

const getRoundLabel = (round: PlayoffRound): string => {
  switch (round) {
    case "RoundOf16": return "Octavos de Final";
    case "QuarterFinals": return "Cuartos de Final";
    case "SemiFinals": return "Semifinales";
    case "Finals": return "Final";
    default: return "Playoffs";
  }
};

interface BracketPosition {
  matchIndex: number;
  position: 1 | 2;
  playerId: number | null;
}

function CreateBracketView({ tournamentId, categoryId }: CreateBracketViewProps) {
  const router = useRouter();

  // Fetch tournament info
  const { tournament, isLoading: isLoadingTournament } = useTournament({ idTournament: tournamentId });

  // Fetch categories to get the specific category info
  const { categories, isLoading: isLoadingCategories } = useCategoriesForTournament({ idTournament: tournamentId });

  const category = categories.find(c => c.id === categoryId);
  const startingRound: PlayoffRound = (category?.startingPlayoffRound as PlayoffRound) || "QuarterFinals";

  // Check if bracket already exists
  const { data: playoffStatus, isLoading: isLoadingStatus } = usePlayoffStageStatus(
    tournamentId,
    categoryId,
    !!tournamentId && !!categoryId
  );

  const matchCount = getMatchCountForRound(startingRound);
  const requiredPlayers = matchCount * 2;

  // Fetch participants
  const { data: participants = [], isLoading: isLoadingParticipants } =
    useParticipantsByTournamentCategory(tournamentId, categoryId, true);

  // Mutation for creating bracket
  const createBracketMutation = useManualBracketMutation();

  // State for bracket assignments
  const [bracketAssignments, setBracketAssignments] = useState<BracketPosition[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<"manual" | "auto" | "random">("auto");

  // Initialize empty bracket positions
  useEffect(() => {
    const positions: BracketPosition[] = [];
    for (let i = 0; i < matchCount; i++) {
      positions.push({ matchIndex: i, position: 1, playerId: null });
      positions.push({ matchIndex: i, position: 2, playerId: null });
    }
    setBracketAssignments(positions);
  }, [matchCount]);

  // Auto-seed by ranking (position field)
  const handleAutoSeed = () => {
    const sortedPlayers = [...participants]
      .filter(p => p.isActive)
      .sort((a, b) => (a.position || 999) - (b.position || 999))
      .slice(0, requiredPlayers);

    if (sortedPlayers.length < requiredPlayers) {
      toast.error(`Se requieren ${requiredPlayers} jugadores activos. Solo hay ${sortedPlayers.length}.`);
      return;
    }

    const newAssignments: BracketPosition[] = [];

    // Classic seeding: 1 vs last, 2 vs second-to-last, etc.
    for (let i = 0; i < matchCount; i++) {
      newAssignments.push({
        matchIndex: i,
        position: 1,
        playerId: sortedPlayers[i].idPlayer,
      });
      newAssignments.push({
        matchIndex: i,
        position: 2,
        playerId: sortedPlayers[requiredPlayers - 1 - i].idPlayer,
      });
    }

    setBracketAssignments(newAssignments);
    toast.success("Bracket asignado por ranking");
  };

  // Random seed
  const handleRandomSeed = () => {
    const activePlayers = participants.filter(p => p.isActive);

    if (activePlayers.length < requiredPlayers) {
      toast.error(`Se requieren ${requiredPlayers} jugadores activos. Solo hay ${activePlayers.length}.`);
      return;
    }

    const shuffled = [...activePlayers]
      .sort(() => Math.random() - 0.5)
      .slice(0, requiredPlayers);

    const newAssignments: BracketPosition[] = [];

    for (let i = 0; i < matchCount; i++) {
      newAssignments.push({
        matchIndex: i,
        position: 1,
        playerId: shuffled[i * 2].idPlayer,
      });
      newAssignments.push({
        matchIndex: i,
        position: 2,
        playerId: shuffled[i * 2 + 1].idPlayer,
      });
    }

    setBracketAssignments(newAssignments);
    toast.success("Bracket asignado aleatoriamente");
  };

  // Manual assignment
  const handleManualAssignment = (matchIndex: number, position: 1 | 2, playerId: number) => {
    setBracketAssignments(prev => {
      const newAssignments = [...prev];
      const idx = newAssignments.findIndex(
        a => a.matchIndex === matchIndex && a.position === position
      );
      if (idx !== -1) {
        newAssignments[idx].playerId = playerId;
      }
      return newAssignments;
    });
  };

  // Get player by ID
  const getPlayer = (playerId: number | null): TournamentParticipant | null => {
    if (!playerId) return null;
    return participants.find(p => p.idPlayer === playerId) || null;
  };

  // Check if all positions filled
  const isComplete = useMemo(() => {
    return bracketAssignments.every(a => a.playerId !== null);
  }, [bracketAssignments]);

  // Check for duplicates
  const hasDuplicates = useMemo(() => {
    const playerIds = bracketAssignments
      .filter(a => a.playerId !== null)
      .map(a => a.playerId);
    return new Set(playerIds).size !== playerIds.length;
  }, [bracketAssignments]);

  // Get available players for a position
  const getAvailablePlayers = (currentMatchIndex: number, currentPosition: 1 | 2) => {
    const assignedIds = bracketAssignments
      .filter(a => a.playerId !== null && !(a.matchIndex === currentMatchIndex && a.position === currentPosition))
      .map(a => a.playerId);

    return participants.filter(
      p => p.isActive && !assignedIds.includes(p.idPlayer)
    );
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!isComplete) {
      toast.error("Debes asignar todos los jugadores al bracket");
      return;
    }

    if (hasDuplicates) {
      toast.error("No puedes asignar el mismo jugador dos veces");
      return;
    }

    // Build matches array
    const matches: ManualBracketMatchup[] = [];
    for (let i = 0; i < matchCount; i++) {
      const player1 = bracketAssignments.find(a => a.matchIndex === i && a.position === 1);
      const player2 = bracketAssignments.find(a => a.matchIndex === i && a.position === 2);

      if (player1?.playerId && player2?.playerId) {
        matches.push({
          positionInBracket: i + 1,
          user1Id: player1.playerId,
          user2Id: player2.playerId,
        });
      }
    }

    try {
      await createBracketMutation.mutateAsync({
        tournamentId,
        categoryId,
        startingRound,
        matches,
      });

      toast.success("Bracket creado exitosamente!");
      // Navigate to view bracket page
      router.push(`/admin/torneos/${tournamentId}/bracket/${categoryId}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error al crear el bracket");
    }
  };

  const handleBack = () => {
    router.push(`/admin/torneos/${tournamentId}`);
  };

  // Loading state
  if (isLoadingTournament || isLoadingCategories || isLoadingParticipants || isLoadingStatus) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Bracket already exists - redirect
  if (playoffStatus?.exists) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            El bracket ya fue creado para esta categoria.
          </AlertDescription>
        </Alert>
        <div className="flex gap-4">
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Torneo
          </Button>
          <Button onClick={() => router.push(`/admin/torneos/${tournamentId}/bracket/${categoryId}`)}>
            Ver Bracket
          </Button>
        </div>
      </div>
    );
  }

  const activePlayers = participants.filter(p => p.isActive);

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Button onClick={handleBack} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Torneo
        </Button>

        <h1 className="text-2xl font-bold text-gray-900">
          Crear Bracket - {category?.name || "Categoria"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {tournament?.name} - {getRoundLabel(startingRound)}
        </p>
      </div>

      {/* Info Card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Informacion del Bracket</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Ronda Inicial:</span>
              <p className="font-medium">{getRoundLabel(startingRound)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Partidos:</span>
              <p className="font-medium">{matchCount}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Jugadores Requeridos:</span>
              <p className="font-medium">{requiredPlayers}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Jugadores Disponibles:</span>
              <p className={`font-medium ${activePlayers.length >= requiredPlayers ? 'text-green-600' : 'text-red-600'}`}>
                {activePlayers.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Not enough players warning */}
      {activePlayers.length < requiredPlayers ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No hay suficientes jugadores activos. Se requieren {requiredPlayers} jugadores, pero solo hay {activePlayers.length} activos.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Seeding Method Tabs */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Metodo de Asignacion</CardTitle>
              <CardDescription>
                Selecciona como quieres asignar los jugadores al bracket
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="auto" className="w-full" onValueChange={(v) => setSelectedMethod(v as any)}>
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="auto">
                    <Trophy className="h-4 w-4 mr-2" />
                    Ranking
                  </TabsTrigger>
                  <TabsTrigger value="random">
                    <Shuffle className="h-4 w-4 mr-2" />
                    Aleatorio
                  </TabsTrigger>
                  <TabsTrigger value="manual">
                    <User className="h-4 w-4 mr-2" />
                    Manual
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="auto" className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-900">
                      Los jugadores seran asignados segun su posicion en el ranking.
                      El 1ro enfrentara al ultimo, el 2do al penultimo, etc.
                    </p>
                  </div>
                  <Button onClick={handleAutoSeed} className="w-full" size="lg">
                    Generar Bracket por Ranking
                  </Button>
                </TabsContent>

                <TabsContent value="random" className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-900">
                      Los jugadores seran asignados aleatoriamente al bracket.
                    </p>
                  </div>
                  <Button onClick={handleRandomSeed} className="w-full" size="lg" variant="secondary">
                    Generar Bracket Aleatorio
                  </Button>
                </TabsContent>

                <TabsContent value="manual" className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <p className="text-sm text-amber-900">
                      Selecciona manualmente los jugadores para cada posicion del bracket.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Bracket Matches */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Partidos del Bracket</span>
                {isComplete && !hasDuplicates && (
                  <Badge className="bg-green-600">Completo</Badge>
                )}
                {hasDuplicates && (
                  <Badge variant="destructive">Jugadores duplicados</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: matchCount }).map((_, matchIdx) => {
                  const player1Assignment = bracketAssignments.find(
                    a => a.matchIndex === matchIdx && a.position === 1
                  );
                  const player2Assignment = bracketAssignments.find(
                    a => a.matchIndex === matchIdx && a.position === 2
                  );
                  const player1 = getPlayer(player1Assignment?.playerId || null);
                  const player2 = getPlayer(player2Assignment?.playerId || null);
                  const availablePlayers = getAvailablePlayers(matchIdx, 1);

                  return (
                    <div key={matchIdx} className="border rounded-lg p-4 bg-card">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-muted-foreground">
                          Partido {matchIdx + 1}
                        </span>
                        {player1 && player2 && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Completo
                          </Badge>
                        )}
                      </div>

                      {selectedMethod === "manual" ? (
                        <div className="space-y-3">
                          <select
                            className="w-full p-3 border rounded-lg text-sm bg-white"
                            value={player1Assignment?.playerId || ""}
                            onChange={(e) =>
                              handleManualAssignment(matchIdx, 1, Number(e.target.value))
                            }
                          >
                            <option value="">Seleccionar Jugador 1...</option>
                            {player1 && (
                              <option value={player1.idPlayer}>
                                {player1.name} {player1.lastname} {player1.position ? `(#${player1.position})` : ""}
                              </option>
                            )}
                            {availablePlayers
                              .filter(p => p.idPlayer !== player1?.idPlayer)
                              .map(p => (
                                <option key={p.idPlayer} value={p.idPlayer}>
                                  {p.name} {p.lastname} {p.position ? `(#${p.position})` : ""}
                                </option>
                              ))}
                          </select>

                          <div className="text-center text-xs font-bold text-muted-foreground py-1">VS</div>

                          <select
                            className="w-full p-3 border rounded-lg text-sm bg-white"
                            value={player2Assignment?.playerId || ""}
                            onChange={(e) =>
                              handleManualAssignment(matchIdx, 2, Number(e.target.value))
                            }
                          >
                            <option value="">Seleccionar Jugador 2...</option>
                            {player2 && (
                              <option value={player2.idPlayer}>
                                {player2.name} {player2.lastname} {player2.position ? `(#${player2.position})` : ""}
                              </option>
                            )}
                            {availablePlayers
                              .filter(p => p.idPlayer !== player2?.idPlayer)
                              .map(p => (
                                <option key={p.idPlayer} value={p.idPlayer}>
                                  {p.name} {p.lastname} {p.position ? `(#${p.position})` : ""}
                                </option>
                              ))}
                          </select>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="p-3 bg-muted rounded-lg text-sm">
                            {player1 ? (
                              <span className="font-medium">
                                {player1.name} {player1.lastname}
                                {player1.position && (
                                  <Badge variant="secondary" className="ml-2">
                                    #{player1.position}
                                  </Badge>
                                )}
                              </span>
                            ) : (
                              <span className="text-muted-foreground italic">Sin asignar</span>
                            )}
                          </div>

                          <div className="text-center text-xs font-bold text-muted-foreground py-1">VS</div>

                          <div className="p-3 bg-muted rounded-lg text-sm">
                            {player2 ? (
                              <span className="font-medium">
                                {player2.name} {player2.lastname}
                                {player2.position && (
                                  <Badge variant="secondary" className="ml-2">
                                    #{player2.position}
                                  </Badge>
                                )}
                              </span>
                            ) : (
                              <span className="text-muted-foreground italic">Sin asignar</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={handleBack} disabled={createBracketMutation.isPending}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isComplete || hasDuplicates || createBracketMutation.isPending}
              size="lg"
            >
              {createBracketMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando Bracket...
                </>
              ) : (
                "Crear Bracket"
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default CreateBracketView;
