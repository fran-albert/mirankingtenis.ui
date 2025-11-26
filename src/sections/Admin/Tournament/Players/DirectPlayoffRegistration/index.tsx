import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNonParticipants, useCreateParticipantsForTournament } from "@/hooks/Tournament-Participant/useTournamentParticipant";
import { getPlayoffStageStatus } from "@/api/Playoff/get-playoff-stage-status.action";
import { TournamentCategory } from "@/types/Tournament-Category/TournamentCategory";
import { toast } from "sonner";
import { Loader2, UserPlus, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQueries } from "@tanstack/react-query";

interface DirectPlayoffRegistrationProps {
  tournamentId: number;
  categories: TournamentCategory[];
}

interface PlayerSelection {
  userId: number;
  position: number | null;
}

const getRequiredPlayers = (round?: string): number => {
  switch (round) {
    case "RoundOf16": return 16;
    case "QuarterFinals": return 8;
    case "SemiFinals": return 4;
    case "Finals": return 2;
    default: return 8;
  }
};

const getRoundLabel = (round?: string): string => {
  switch (round) {
    case "RoundOf16": return "Octavos de Final";
    case "QuarterFinals": return "Cuartos de Final";
    case "SemiFinals": return "Semifinales";
    case "Finals": return "Final";
    default: return "Playoffs";
  }
};

function DirectPlayoffRegistration({
  tournamentId,
  categories,
}: DirectPlayoffRegistrationProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<Map<number, number | null>>(new Map());

  // Filter categories that have skipGroupStage first
  const skipGroupStageCategories = useMemo(() => {
    return categories.filter(cat => cat.skipGroupStage);
  }, [categories]);

  // Check playoff status for each skipGroupStage category using useQueries
  const categoryStatusQueries = useQueries({
    queries: skipGroupStageCategories.map(cat => ({
      queryKey: ["playoff-stage-status", tournamentId, cat.id],
      queryFn: () => getPlayoffStageStatus(tournamentId, cat.id),
      enabled: !!tournamentId && cat.skipGroupStage === true,
      staleTime: 5 * 60 * 1000,
      retry: false,
    })),
  });

  // Get non-participants
  const { data: nonParticipants = [], isLoading: isLoadingPlayers } = useNonParticipants(
    tournamentId,
    !!tournamentId
  );

  // Mutation for creating participants
  const createParticipantsMutation = useCreateParticipantsForTournament();

  // Filter categories that have skipGroupStage AND don't have bracket created yet
  const playoffCategories = useMemo(() => {
    return skipGroupStageCategories.filter((cat, index) => {
      const query = categoryStatusQueries[index];
      // If query is still loading, show the category (will be filtered once loaded)
      if (query.isLoading) return true;
      // If bracket exists, don't show in dropdown
      return !query.data?.exists;
    });
  }, [skipGroupStageCategories, categoryStatusQueries]);

  const selectedCategory = useMemo(() => {
    return playoffCategories.find(cat => cat.id === selectedCategoryId);
  }, [playoffCategories, selectedCategoryId]);

  const requiredPlayers = useMemo(() => {
    if (!selectedCategory) return 0;
    return getRequiredPlayers(selectedCategory.startingPlayoffRound);
  }, [selectedCategory]);

  const roundLabel = useMemo(() => {
    if (!selectedCategory) return "";
    return getRoundLabel(selectedCategory.startingPlayoffRound);
  }, [selectedCategory]);

  // Handle player checkbox
  const handlePlayerToggle = (userId: number, checked: boolean) => {
    setSelectedPlayers(prev => {
      const newMap = new Map(prev);
      if (checked) {
        newMap.set(userId, null); // null = auto position
      } else {
        newMap.delete(userId);
      }
      return newMap;
    });
  };

  // Handle position change
  const handlePositionChange = (userId: number, position: string) => {
    setSelectedPlayers(prev => {
      const newMap = new Map(prev);
      newMap.set(userId, position === "auto" ? null : parseInt(position));
      return newMap;
    });
  };

  // Get available positions for dropdown
  const getAvailablePositions = (currentUserId: number): number[] => {
    const usedPositions = Array.from(selectedPlayers.entries())
      .filter(([userId, pos]) => userId !== currentUserId && pos !== null)
      .map(([, pos]) => pos as number);

    return Array.from({ length: requiredPlayers }, (_, i) => i + 1)
      .filter(pos => !usedPositions.includes(pos));
  };

  // Check if position is already taken
  const isPositionTaken = (position: number, excludeUserId?: number): boolean => {
    return Array.from(selectedPlayers.entries()).some(
      ([userId, pos]) => userId !== excludeUserId && pos === position
    );
  };

  // Validate and submit
  const handleSubmit = async () => {
    if (!selectedCategoryId) {
      toast.error("Selecciona una categoría");
      return;
    }

    const playerCount = selectedPlayers.size;

    if (playerCount !== requiredPlayers) {
      toast.error(
        `Debes inscribir exactamente ${requiredPlayers} jugadores para ${roundLabel}. ` +
        `Actualmente tienes ${playerCount} seleccionado${playerCount !== 1 ? 's' : ''}.`
      );
      return;
    }

    // Check for duplicate positions
    const positions = Array.from(selectedPlayers.values()).filter(pos => pos !== null);
    const uniquePositions = new Set(positions);
    if (positions.length !== uniquePositions.size) {
      toast.error("No puedes asignar la misma posición a múltiples jugadores");
      return;
    }

    // Prepare data
    const userIds = Array.from(selectedPlayers.keys());
    const positionInitials = Array.from(selectedPlayers.values());
    // For skipGroupStage categories, we want to use positions for seeding
    // Set directToPlayoffsFlags to false so positions are used
    const directToPlayoffsFlags = Array(userIds.length).fill(false);

    try {
      await createParticipantsMutation.mutateAsync({
        idTournament: tournamentId,
        idCategory: selectedCategoryId,
        userIds,
        positionInitials,
        directToPlayoffsFlags,
      });

      toast.success(`${playerCount} jugador(es) inscrito(s) exitosamente`);
      setSelectedPlayers(new Map());
      setSelectedCategoryId(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error al inscribir jugadores");
    }
  };

  if (playoffCategories.length === 0) {
    return null; // Don't show if no playoff categories
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Inscripción Rápida - Playoffs Directos
          </CardTitle>
          <Badge variant="outline" className="bg-purple-50">
            Simplificado
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Info box */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md flex gap-2">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <strong>Inscripción simplificada:</strong> Selecciona jugadores y opcionalmente asigna
            posiciones para el seeding del bracket. Las posiciones no asignadas se completarán
            automáticamente en orden de inscripción.
          </div>
        </div>

        {/* Category selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Categoría</label>
          <Select
            value={selectedCategoryId?.toString() || ""}
            onValueChange={(value) => {
              setSelectedCategoryId(parseInt(value));
              setSelectedPlayers(new Map()); // Reset selections
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría..." />
            </SelectTrigger>
            <SelectContent>
              {playoffCategories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  Categoría {category.name} - {getRoundLabel(category.startingPlayoffRound)} (
                  {getRequiredPlayers(category.startingPlayoffRound)} jugadores)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCategory && (
          <>
            {/* Category info */}
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
              <div className="text-sm">
                <div className="font-medium text-purple-900">
                  Categoría {selectedCategory.name} - {roundLabel}
                </div>
                <div className="text-xs mt-1">
                  Jugadores seleccionados:{' '}
                  <span className={
                    selectedPlayers.size === requiredPlayers
                      ? 'text-green-600 font-bold'
                      : selectedPlayers.size > requiredPlayers
                        ? 'text-red-600 font-bold'
                        : 'text-orange-600 font-bold'
                  }>
                    {selectedPlayers.size}
                  </span>
                  {' / '}
                  <span className="font-semibold text-purple-900">{requiredPlayers}</span>
                  {selectedPlayers.size === requiredPlayers && (
                    <span className="text-green-600 ml-1">✓ Completo</span>
                  )}
                  {selectedPlayers.size < requiredPlayers && (
                    <span className="text-orange-600 ml-1">
                      (Faltan {requiredPlayers - selectedPlayers.size})
                    </span>
                  )}
                  {selectedPlayers.size > requiredPlayers && (
                    <span className="text-red-600 ml-1">
                      (Excede por {selectedPlayers.size - requiredPlayers})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Players table */}
            {isLoadingPlayers ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : nonParticipants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay jugadores disponibles para inscribir
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium">Seleccionar</th>
                        <th className="text-left p-3 text-sm font-medium">Jugador</th>
                        <th className="text-left p-3 text-sm font-medium">
                          Posición (Seeding)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {nonParticipants.map((player) => {
                        const isSelected = selectedPlayers.has(player.id);
                        const currentPosition = selectedPlayers.get(player.id);
                        const availablePositions = getAvailablePositions(player.id);

                        return (
                          <tr key={player.id} className="border-t hover:bg-muted/50">
                            <td className="p-3">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) =>
                                  handlePlayerToggle(player.id, Boolean(checked))
                                }
                                disabled={
                                  !isSelected &&
                                  selectedPlayers.size >= requiredPlayers
                                }
                              />
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                {player.photo && (
                                  <img
                                    src={player.photo}
                                    alt={player.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                )}
                                <span className="font-medium">
                                  {player.name} {player.lastname}
                                </span>
                              </div>
                            </td>
                            <td className="p-3">
                              {isSelected ? (
                                <Select
                                  value={
                                    currentPosition === null || currentPosition === undefined
                                      ? "auto"
                                      : currentPosition.toString()
                                  }
                                  onValueChange={(value) =>
                                    handlePositionChange(player.id, value)
                                  }
                                >
                                  <SelectTrigger className="w-40">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="auto">
                                      Automática
                                    </SelectItem>
                                    {availablePositions.map((pos) => (
                                      <SelectItem key={pos} value={pos.toString()}>
                                        Posición #{pos}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Submit button */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedPlayers(new Map());
                  setSelectedCategoryId(null);
                }}
                disabled={createParticipantsMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  selectedPlayers.size !== requiredPlayers ||
                  createParticipantsMutation.isPending
                }
              >
                {createParticipantsMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inscribiendo...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Inscribir {selectedPlayers.size} Jugador(es)
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default DirectPlayoffRegistration;
