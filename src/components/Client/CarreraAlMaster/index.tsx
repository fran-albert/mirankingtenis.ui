"use client";

import { useState, useMemo } from "react";
import { useCurrentLeagueTournament } from "@/hooks/Tournament/useCurrentLeagueTournament";
import { useCategoriesForTournament } from "@/hooks/Tournament-Category/useTournamentCategories";
import { useTournamentCategoryId } from "@/hooks/Tournament-Category/useTournamentCategories";
import { useTournamentRanking } from "@/hooks/Tournament-Ranking/useTournamentRanking";
import { CategorySelect } from "@/components/Select/Category/select";
import PlayerCard from "@/sections/CarreraAlMaster/PlayerCard";
import { Trophy, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function CarreraAlMasterClient() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  // Hook para obtener el torneo actual de liga
  const {
    currentLeagueTournament,
    isLoading: isTournamentLoading,
    hasCurrentLeagueTournament,
  } = useCurrentLeagueTournament();

  // Hook para obtener las categorías del torneo
  const { categories, isLoading: isCategoriesLoading } =
    useCategoriesForTournament({
      idTournament: currentLeagueTournament?.id || 0,
      enabled: !!currentLeagueTournament,
    });

  // Hook para obtener el ID de la categoría del torneo
  const { tournamentCategoryId, isLoading: isTournamentCategoryLoading } =
    useTournamentCategoryId({
      idTournament: currentLeagueTournament?.id || 0,
      idCategory: parseInt(selectedCategoryId) || 0,
      enabled: !!currentLeagueTournament && !!selectedCategoryId,
    });

  // Hook para obtener el ranking de la categoría
  const { rankings, isLoading: isRankingLoading } = useTournamentRanking({
    idTournament: currentLeagueTournament?.id || 0,
    idCategory: parseInt(selectedCategoryId) || 0,
    enabled: !!currentLeagueTournament && !!selectedCategoryId,
  });

  // Obtener los primeros 8 jugadores
  const top8Players = useMemo(() => {
    if (!rankings || rankings.length === 0) return [];
    return rankings.sort((a, b) => a.position - b.position).slice(0, 8);
  }, [rankings]);

  // Estados de carga
  const isLoading =
    isTournamentLoading ||
    isCategoriesLoading ||
    isTournamentCategoryLoading ||
    isRankingLoading;
  const hasData = top8Players.length > 0;

  // Componente de skeleton para las cards
  const SkeletonCard = () => (
    <Card className="bg-white border-2 border-gray-100">
      <CardContent className="p-6">
        <div className="flex justify-center mb-4">
          <div className="h-8 w-16 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="text-center space-y-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse mx-auto w-3/4"></div>
          <div className="h-5 bg-gray-200 rounded animate-pulse mx-auto w-1/2"></div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse mt-1"></div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-900">
              Carrera al Master
            </h1>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Los 8 mejores jugadores clasificados para el Master
          </p>

          {/* Tournament Info */}
          {currentLeagueTournament && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 inline-block">
              <p className="text-blue-800 font-medium">
                Torneo actual:{" "}
                <span className="font-bold">
                  {currentLeagueTournament.name}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Loading state for tournament */}
        {isTournamentLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">
              Cargando torneo actual...
            </span>
          </div>
        )}

        {/* No current tournament */}
        {!isTournamentLoading && !hasCurrentLeagueTournament && (
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No hay ningún torneo de liga en progreso en este momento.
            </AlertDescription>
          </Alert>
        )}

        {/* Tournament found - Show category selector and players */}
        {hasCurrentLeagueTournament && (
          <>
            {/* Category Filter */}
            <div className="mb-8">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-6">
                    <Trophy className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      Categoría:
                    </Label>
                    <div className="flex-1">
                      <CategorySelect
                        selected={selectedCategoryId}
                        onCategory={setSelectedCategoryId}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category selected but loading */}
            {selectedCategoryId && isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            )}

            {/* No players found */}
            {selectedCategoryId && !isLoading && top8Players.length === 0 && (
              <Alert className="mb-8">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No se encontraron jugadores para esta categoría.
                </AlertDescription>
              </Alert>
            )}

            {/* Players Grid */}
            {hasData && !isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {top8Players.map((player, index) => (
                  <PlayerCard key={player.idPlayer} player={player} />
                ))}
              </div>
            )}

            {/* Instructions when no category selected */}
            {!selectedCategoryId && !isCategoriesLoading && (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  Selecciona una categoría para ver los jugadores clasificados
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
