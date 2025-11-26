"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  useRoundOf16,
  useQuarterFinals,
  useSemifinals,
  useFinals,
  usePlayoffStageStatus
} from "@/hooks/PlayOff/usePlayOff";
import { useTournament } from "@/hooks/Tournament/useTournaments";
import { useCategoriesForTournament } from "@/hooks/Tournament-Category/useTournamentCategories";
import RoundOf16Card from "./RoundOf16Card";
import QuarterFinalsCard from "./QuarterFinalsCard";
import SemiFinalsCard from "./SemiFinalsCard";
import FinalsCard from "./FinalsCard";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface BracketViewProps {
  tournamentId: number;
  categoryId: number;
}

function BracketView({ tournamentId, categoryId }: BracketViewProps) {
  const router = useRouter();

  // Obtener info del torneo
  const { tournament, isLoading: isLoadingTournament } = useTournament({
    idTournament: tournamentId
  });

  const { categories, isLoading: isLoadingCategories } = useCategoriesForTournament({
    idTournament: tournamentId
  });

  // Verificar estado del bracket
  const { data: playoffStatus, isLoading: isLoadingStatus } = usePlayoffStageStatus(
    tournamentId,
    categoryId,
    !!tournamentId && !!categoryId
  );

  // Cargar rondas según corresponda
  const { data: roundOf16 = [], isLoading: isLoadingR16 } = useRoundOf16(
    tournamentId,
    categoryId,
    playoffStatus?.startingRound === "RoundOf16"
  );

  const { data: quarterFinals = [], isLoading: isLoadingQuarters } = useQuarterFinals(
    tournamentId,
    categoryId,
    playoffStatus?.exists || false
  );

  const { data: semiFinals = [], isLoading: isLoadingSemis } = useSemifinals(
    tournamentId,
    categoryId,
    playoffStatus?.exists || false
  );

  const { data: finals = [], isLoading: isLoadingFinals } = useFinals(
    tournamentId,
    categoryId,
    playoffStatus?.exists || false
  );

  const isLoading =
    isLoadingTournament ||
    isLoadingCategories ||
    isLoadingStatus ||
    isLoadingR16 ||
    isLoadingQuarters ||
    isLoadingSemis ||
    isLoadingFinals;

  const category = categories?.find((c) => c.id === categoryId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando bracket...</p>
        </div>
      </div>
    );
  }

  if (!tournament || !category) {
    return (
      <div className="container mx-auto p-8 text-center">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Torneo o categoría no encontrado
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>
    );
  }

  if (!playoffStatus?.exists) {
    return (
      <div className="container mx-auto p-8 text-center">
        <Alert className="max-w-md mx-auto bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900">
            <strong>Bracket no creado aún</strong>
            <p className="mt-1 text-sm">
              Este bracket aún no ha sido configurado. Regresa a la página del torneo para crearlo.
            </p>
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al torneo
        </Button>
      </div>
    );
  }

  const hasAnyMatches =
    roundOf16.length > 0 ||
    quarterFinals.length > 0 ||
    semiFinals.length > 0 ||
    finals.length > 0;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-2 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al torneo
          </Button>
          <h1 className="text-3xl font-bold text-primary">{tournament.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-lg text-muted-foreground">
              Categoría {category.name}
            </p>
            <Badge variant="outline" className="bg-blue-50">
              Solo Lectura
            </Badge>
          </div>
        </div>
      </div>

      {/* Info del bracket */}
      {playoffStatus && (
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Información del Bracket</p>
              <p className="text-xs text-muted-foreground mt-1">
                Ronda inicial: <span className="font-medium">{getRoundLabel(playoffStatus.startingRound)}</span>
                {" • "}
                Total de partidos configurados: <span className="font-medium">{playoffStatus.matchesCount}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Brackets */}
      <div className="space-y-6">
        {playoffStatus.startingRound === "RoundOf16" && roundOf16.length > 0 && (
          <RoundOf16Card matches={roundOf16} />
        )}

        {quarterFinals.length > 0 && (
          <QuarterFinalsCard matches={quarterFinals} />
        )}

        {semiFinals.length > 0 && (
          <SemiFinalsCard matches={semiFinals} />
        )}

        {finals.length > 0 && (
          <FinalsCard matches={finals} />
        )}

        {!hasAnyMatches && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No hay partidos disponibles para mostrar en este momento.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}

// Helper para obtener label de ronda
function getRoundLabel(round?: string): string {
  switch (round) {
    case "RoundOf16": return "Octavos de Final";
    case "QuarterFinals": return "Cuartos de Final";
    case "SemiFinals": return "Semifinales";
    case "Finals": return "Final";
    default: return "Playoffs";
  }
}

export default BracketView;
