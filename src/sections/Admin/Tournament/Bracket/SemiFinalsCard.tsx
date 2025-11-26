import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GroupFixtureDto } from "@/common/types/group-fixture.dto";
import { Trophy } from "lucide-react";

interface SemiFinalsCardProps {
  matches: GroupFixtureDto[];
}

function SemiFinalsCard({ matches }: SemiFinalsCardProps) {
  if (!matches || matches.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-purple-600" />
          Semifinales
          <Badge variant="secondary" className="ml-2">
            {matches.length} Partidos
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((match, index) => (
            <MatchCard key={match.id} match={match} label={`SF${index + 1}`} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface MatchCardProps {
  match: GroupFixtureDto;
  label: string;
}

function MatchCard({ match, label }: MatchCardProps) {
  const hasResult = match.status === 'finished';
  const isWinner = (userId: number) => match.idWinner === userId;
  const isPending = match.status === 'pending';

  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="bg-purple-700 px-4 py-2 text-white font-medium flex items-center justify-between">
        <span>{label}</span>
        {hasResult && (
          <Badge variant="outline" className="bg-green-600 text-white border-green-700">
            ✓ Finalizado
          </Badge>
        )}
        {isPending && (
          <Badge variant="outline" className="bg-amber-500 text-white border-amber-600">
            Pendiente
          </Badge>
        )}
      </div>

      {/* Match Content */}
      <div className="p-4 bg-card">
        <div className="space-y-3">
          {/* Player 1 */}
          <div className={`flex items-center gap-3 p-3 rounded transition-colors ${
            hasResult && isWinner(match.user1.id)
              ? 'bg-green-100 border-2 border-green-400 font-semibold'
              : 'bg-muted'
          }`}>
            {match.user1.photo && (
              <img
                src={match.user1.photo}
                alt={match.user1.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
              />
            )}
            <div className="flex-1">
              <p className="font-medium text-lg">
                {match.user1.name} {match.user1.lastname}
              </p>
            </div>
            {hasResult && isWinner(match.user1.id) && (
              <Trophy className="h-6 w-6 text-green-600" />
            )}
          </div>

          {/* VS or Result */}
          <div className="text-center py-2">
            {hasResult && match.finalResult ? (
              <div>
                <p className="font-bold text-lg text-green-700">{match.finalResult}</p>
                {match.shift && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(match.shift.startHour).toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p className="font-bold text-lg text-muted-foreground">VS</p>
                {match.shift && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(match.shift.startHour).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Player 2 */}
          <div className={`flex items-center gap-3 p-3 rounded transition-colors ${
            hasResult && isWinner(match.user2.id)
              ? 'bg-green-100 border-2 border-green-400 font-semibold'
              : 'bg-muted'
          }`}>
            {match.user2.photo && (
              <img
                src={match.user2.photo}
                alt={match.user2.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
              />
            )}
            <div className="flex-1">
              <p className="font-medium text-lg">
                {match.user2.name} {match.user2.lastname}
              </p>
            </div>
            {hasResult && isWinner(match.user2.id) && (
              <Trophy className="h-6 w-6 text-green-600" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SemiFinalsCard;
