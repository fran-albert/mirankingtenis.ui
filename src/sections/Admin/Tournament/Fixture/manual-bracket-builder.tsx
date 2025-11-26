import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayoffRound, ManualBracketMatchup } from "@/types/Tournament-Category/TournamentCategory";
import { useParticipantsByTournamentCategory } from "@/hooks/Tournament-Participant/useTournamentParticipant";
import { TournamentParticipant } from "@/types/Tournament-Participant/TournamentParticipant";
import { toast } from "sonner";
import { Loader2, Shuffle, User, Trophy } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useManualBracketMutation } from "@/hooks/PlayOff/useManualBracket";

interface ManualBracketBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentId: number;
  categoryId: number;
  startingRound: PlayoffRound;
  onSuccess?: () => void;
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

function ManualBracketBuilder({
  isOpen,
  onClose,
  tournamentId,
  categoryId,
  startingRound,
  onSuccess,
}: ManualBracketBuilderProps) {
  const matchCount = getMatchCountForRound(startingRound);
  const requiredPlayers = matchCount * 2;

  // Fetch participants
  const { data: participants = [], isLoading: isLoadingParticipants } =
    useParticipantsByTournamentCategory(tournamentId, categoryId, isOpen);

  // Mutation for creating bracket
  const createBracketMutation = useManualBracketMutation();

  // State for bracket assignments
  const [bracketAssignments, setBracketAssignments] = useState<BracketPosition[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<"manual" | "auto" | "random">("auto");

  // Initialize empty bracket positions
  useEffect(() => {
    if (isOpen) {
      const positions: BracketPosition[] = [];
      for (let i = 0; i < matchCount; i++) {
        positions.push({ matchIndex: i, position: 1, playerId: null });
        positions.push({ matchIndex: i, position: 2, playerId: null });
      }
      setBracketAssignments(positions);
    }
  }, [isOpen, matchCount]);

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
    toast.success("Bracket asignado automáticamente por ranking");
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
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error al crear el bracket");
    }
  };

  const handleClose = () => {
    if (createBracketMutation.isPending) return;
    onClose();
  };

  if (isLoadingParticipants) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const activePlayers = participants.filter(p => p.isActive);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Crear Bracket Manual - {getRoundLabel(startingRound)}</DialogTitle>
          <DialogDescription>
            Asigna {requiredPlayers} jugadores a las {matchCount} llaves del bracket.
            Jugadores disponibles: {activePlayers.length}
          </DialogDescription>
        </DialogHeader>

        {activePlayers.length < requiredPlayers ? (
          <div className="py-8 text-center">
            <p className="text-red-600 font-medium">
              ⚠ No hay suficientes jugadores activos.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Se requieren {requiredPlayers} jugadores, pero solo hay {activePlayers.length} activos.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="auto" className="w-full" onValueChange={(v) => setSelectedMethod(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="auto">
                <Trophy className="h-4 w-4 mr-2" />
                Auto (Ranking)
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
                  Los jugadores serán asignados según su posición en el ranking.
                  El 1° enfrentará al último, el 2° al penúltimo, etc.
                </p>
              </div>
              <Button onClick={handleAutoSeed} className="w-full" size="lg">
                Generar Bracket por Ranking
              </Button>
            </TabsContent>

            <TabsContent value="random" className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-900">
                  Los jugadores serán asignados aleatoriamente al bracket.
                </p>
              </div>
              <Button onClick={handleRandomSeed} className="w-full" size="lg" variant="secondary">
                Generar Bracket Aleatorio
              </Button>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-amber-900">
                  Selecciona manualmente los jugadores para cada posición del bracket.
                </p>
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
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
                      <div key={matchIdx} className="border rounded-lg p-3 bg-card">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            Partido {matchIdx + 1}
                          </span>
                          {player1 && player2 && (
                            <Badge variant="outline" className="bg-green-50">
                              ✓ Completo
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2">
                          <select
                            className="w-full p-2 border rounded text-sm"
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

                          <div className="text-center text-xs text-muted-foreground">vs</div>

                          <select
                            className="w-full p-2 border rounded text-sm"
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
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Bracket Preview - shown after any assignment */}
            {bracketAssignments.some(a => a.playerId !== null) && (
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-3">Vista Previa del Bracket</h3>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
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
                        <div key={matchIdx} className="border rounded-lg p-3 bg-card">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              Partido {matchIdx + 1}
                            </span>
                            {player1 && player2 && (
                              <Badge variant="outline" className="bg-green-50">
                                ✓ Completo
                              </Badge>
                            )}
                          </div>

                          {selectedMethod === "manual" ? (
                            <div className="space-y-2">
                              <select
                                className="w-full p-2 border rounded text-sm"
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

                              <div className="text-center text-xs text-muted-foreground">vs</div>

                              <select
                                className="w-full p-2 border rounded text-sm"
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
                            <div className="space-y-2">
                              <div className="p-2 bg-muted rounded text-sm">
                                {player1 ? (
                                  <span>
                                    {player1.name} {player1.lastname}
                                    {player1.position && (
                                      <Badge variant="secondary" className="ml-2">
                                        #{player1.position}
                                      </Badge>
                                    )}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">Sin asignar</span>
                                )}
                              </div>

                              <div className="text-center text-xs font-semibold">vs</div>

                              <div className="p-2 bg-muted rounded text-sm">
                                {player2 ? (
                                  <span>
                                    {player2.name} {player2.lastname}
                                    {player2.position && (
                                      <Badge variant="secondary" className="ml-2">
                                        #{player2.position}
                                      </Badge>
                                    )}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">Sin asignar</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            )}
          </Tabs>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={createBracketMutation.isPending}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isComplete || hasDuplicates || createBracketMutation.isPending || activePlayers.length < requiredPlayers}
          >
            {createBracketMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              "Crear Bracket"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ManualBracketBuilder;
