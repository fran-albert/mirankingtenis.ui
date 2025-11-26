import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GroupFixtureDto } from "@/common/types/group-fixture.dto";
import { Trophy, Crown } from "lucide-react";

interface FinalsCardProps {
  matches: GroupFixtureDto[];
}

function FinalsCard({ matches }: FinalsCardProps) {
  if (!matches || matches.length === 0) {
    return null;
  }

  const finalMatch = matches[0]; // Solo hay 1 partido en la final

  return (
    <Card className="border-2 border-yellow-400 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-yellow-600" />
          <span className="text-xl">Final</span>
          {finalMatch.status === 'finished' && (
            <Badge variant="outline" className="bg-green-600 text-white border-green-700 ml-auto">
              ✓ Finalizado
            </Badge>
          )}
          {finalMatch.status === 'pending' && (
            <Badge variant="outline" className="bg-amber-500 text-white border-amber-600 ml-auto">
              Pendiente
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <FinalMatchCard match={finalMatch} />
      </CardContent>
    </Card>
  );
}

interface FinalMatchCardProps {
  match: GroupFixtureDto;
}

function FinalMatchCard({ match }: FinalMatchCardProps) {
  const hasResult = match.status === 'finished';
  const isWinner = (userId: number) => match.idWinner === userId;
  const isChampion = hasResult && match.idWinner;

  return (
    <div className="space-y-4">
      {/* Player 1 */}
      <div className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
        hasResult && isWinner(match.user1.id)
          ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-400 shadow-lg transform scale-105'
          : 'bg-muted hover:bg-muted/80'
      }`}>
        <div className="relative">
          {match.user1.photo && (
            <img
              src={match.user1.photo}
              alt={match.user1.name}
              className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
            />
          )}
          {hasResult && isWinner(match.user1.id) && (
            <Crown className="absolute -top-2 -right-2 h-8 w-8 text-yellow-600 animate-bounce" />
          )}
        </div>
        <div className="flex-1">
          <p className={`font-bold text-xl ${
            hasResult && isWinner(match.user1.id) ? 'text-yellow-800' : ''
          }`}>
            {match.user1.name} {match.user1.lastname}
          </p>
          {hasResult && isWinner(match.user1.id) && (
            <p className="text-sm font-semibold text-yellow-700 flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              Campeón
            </p>
          )}
        </div>
        {hasResult && isWinner(match.user1.id) && (
          <Trophy className="h-8 w-8 text-yellow-600" />
        )}
      </div>

      {/* VS or Result */}
      <div className="text-center py-3">
        {hasResult && match.finalResult ? (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="font-bold text-2xl text-green-700">{match.finalResult}</p>
            {match.shift && (
              <p className="text-sm text-muted-foreground mt-2">
                📅 {new Date(match.shift.startHour).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="font-bold text-2xl text-amber-700">VS</p>
            {match.shift && (
              <p className="text-sm text-muted-foreground mt-2">
                📅 {new Date(match.shift.startHour).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Player 2 */}
      <div className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
        hasResult && isWinner(match.user2.id)
          ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-400 shadow-lg transform scale-105'
          : 'bg-muted hover:bg-muted/80'
      }`}>
        <div className="relative">
          {match.user2.photo && (
            <img
              src={match.user2.photo}
              alt={match.user2.name}
              className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
            />
          )}
          {hasResult && isWinner(match.user2.id) && (
            <Crown className="absolute -top-2 -right-2 h-8 w-8 text-yellow-600 animate-bounce" />
          )}
        </div>
        <div className="flex-1">
          <p className={`font-bold text-xl ${
            hasResult && isWinner(match.user2.id) ? 'text-yellow-800' : ''
          }`}>
            {match.user2.name} {match.user2.lastname}
          </p>
          {hasResult && isWinner(match.user2.id) && (
            <p className="text-sm font-semibold text-yellow-700 flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              Campeón
            </p>
          )}
        </div>
        {hasResult && isWinner(match.user2.id) && (
          <Trophy className="h-8 w-8 text-yellow-600" />
        )}
      </div>

      {/* Sets detail if available */}
      {hasResult && match.sets && match.sets.length > 0 && (
        <div className="bg-slate-50 p-4 rounded-lg border">
          <p className="text-sm font-medium text-slate-700 mb-2">Detalle de sets:</p>
          <div className="flex gap-2 justify-center">
            {match.sets
              .sort((a, b) => a.setNumber - b.setNumber)
              .map((set, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {set.pointsPlayer1}-{set.pointsPlayer2}
                </Badge>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FinalsCard;
