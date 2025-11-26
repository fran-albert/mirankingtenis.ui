import React from "react";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TournamentCategory } from "@/types/Tournament-Category/TournamentCategory";
import { useHasPlayersForCategory } from "@/hooks/Tournament-Participant/useTournamentParticipant";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Play, Eye } from "lucide-react";
import { usePlayoffStageStatus } from "@/hooks/PlayOff/usePlayOff";
import { useRouter } from "next/navigation";

interface DirectPlayoffCardProps {
  category: TournamentCategory;
  idTournament: number;
  onBracketCreated?: (categoryId: number) => void;
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

function DirectPlayoffCard({
  category,
  idTournament,
  onBracketCreated,
}: DirectPlayoffCardProps) {
  const router = useRouter();

  const { data: hasParticipants = false } = useHasPlayersForCategory(
    idTournament,
    category.id,
    !!idTournament && !!category.id
  );

  const { data: playoffStatus, isLoading: isLoadingStatus } = usePlayoffStageStatus(
    idTournament,
    category.id,
    !!idTournament && !!category.id
  );

  const requiredPlayers = getRequiredPlayers(category.startingPlayoffRound);
  const roundLabel = getRoundLabel(category.startingPlayoffRound);

  const bracketCreated = playoffStatus?.exists || false;

  const handleCreateBracket = () => {
    router.push(`/admin/torneos/${idTournament}/bracket/${category.id}/create`);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Categoría {category.name}</CardTitle>
            <Badge variant="outline" className="bg-blue-50">
              Directo a {roundLabel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bracketCreated ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Bracket creado</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Bracket no creado</span>
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              <p>Ronda inicial: <span className="font-medium">{roundLabel}</span></p>
              <p>Jugadores requeridos: <span className="font-medium">{requiredPlayers}</span></p>
              {/* TODO: Mostrar conteo real de jugadores */}
              <p className={hasParticipants ? "text-green-600" : "text-red-600"}>
                {hasParticipants ? "✓ Jugadores registrados" : "✗ Sin jugadores registrados"}
              </p>
            </div>

            {!bracketCreated && (
              <div className="pt-2">
                {hasParticipants ? (
                  <Button
                    onClick={handleCreateBracket}
                    className="w-full"
                    variant="default"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Crear Bracket
                  </Button>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Agrega jugadores a la categoria para crear el bracket
                  </p>
                )}
              </div>
            )}

            {bracketCreated && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/admin/torneos/${idTournament}/bracket/${category.id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Bracket
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DirectPlayoffCard;
