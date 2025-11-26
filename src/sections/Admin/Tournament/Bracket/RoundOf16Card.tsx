import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GroupFixtureDto } from "@/common/types/group-fixture.dto";
import { Trophy } from "lucide-react";

interface RoundOf16CardProps {
  matches: GroupFixtureDto[];
}

function RoundOf16Card({ matches }: RoundOf16CardProps) {
  if (!matches || matches.length === 0) {
    return null;
  }

  // Agrupar en 2 zonas de 4 partidos cada una para mejor visualización
  const leftBracket = matches.slice(0, 4);
  const rightBracket = matches.slice(4, 8);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-blue-600" />
          Octavos de Final
          <Badge variant="secondary" className="ml-2">
            {matches.length} Partidos
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left bracket - Zona A */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">
              Zona A
            </h3>
            {leftBracket.map((match, idx) => (
              <MatchCard key={match.id} match={match} position={idx + 1} />
            ))}
          </div>

          {/* Right bracket - Zona B */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">
              Zona B
            </h3>
            {rightBracket.map((match, idx) => (
              <MatchCard key={match.id} match={match} position={idx + 5} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MatchCardProps {
  match: GroupFixtureDto;
  position: number;
}

function MatchCard({ match, position }: MatchCardProps) {
  const hasResult = match.status === 'finished';
  const isWinner = (userId: number) => match.idWinner === userId;
  const isPending = match.status === 'pending';

  return (
    <div className="border rounded-lg p-3 bg-card shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">
          Partido {position}
        </span>
        {hasResult && (
          <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
            Finalizado
          </Badge>
        )}
        {isPending && (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 text-xs">
            Pendiente
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        {/* Player 1 */}
        <div className={`flex items-center justify-between p-2 rounded transition-colors ${
          hasResult && isWinner(match.user1.id)
            ? 'bg-green-100 border border-green-300 font-semibold'
            : 'bg-muted hover:bg-muted/80'
        }`}>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {match.user1.photo && (
              <img
                src={match.user1.photo}
                alt={match.user1.name}
                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
              />
            )}
            <span className="text-sm truncate">
              {match.user1.name} {match.user1.lastname}
            </span>
          </div>
          {hasResult && isWinner(match.user1.id) && (
            <Trophy className="h-4 w-4 text-green-600 flex-shrink-0 ml-2" />
          )}
        </div>

        {/* VS */}
        <div className="text-center text-xs font-semibold text-muted-foreground py-1">
          vs
        </div>

        {/* Player 2 */}
        <div className={`flex items-center justify-between p-2 rounded transition-colors ${
          hasResult && isWinner(match.user2.id)
            ? 'bg-green-100 border border-green-300 font-semibold'
            : 'bg-muted hover:bg-muted/80'
        }`}>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {match.user2.photo && (
              <img
                src={match.user2.photo}
                alt={match.user2.name}
                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
              />
            )}
            <span className="text-sm truncate">
              {match.user2.name} {match.user2.lastname}
            </span>
          </div>
          {hasResult && isWinner(match.user2.id) && (
            <Trophy className="h-4 w-4 text-green-600 flex-shrink-0 ml-2" />
          )}
        </div>

        {/* Result */}
        {hasResult && match.finalResult && (
          <div className="text-center text-sm font-medium text-green-700 mt-2 pt-2 border-t">
            {match.finalResult}
          </div>
        )}
      </div>
    </div>
  );
}

export default RoundOf16Card;
