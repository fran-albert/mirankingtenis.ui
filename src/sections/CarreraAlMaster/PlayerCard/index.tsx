"use client"

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { OptimizedAvatar } from "@/components/ui/optimized-avatar";
import { TournamentRanking } from "@/types/Tournament-Ranking/TournamentRanking";
import Link from "next/link";

interface PlayerCardProps {
  player: TournamentRanking;
}

export default function PlayerCard({ player }: PlayerCardProps) {
  const getPositionBadgeColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case 2:
        return "bg-gray-400 text-white hover:bg-gray-500";
      case 3:
        return "bg-amber-600 text-white hover:bg-amber-700";
      default:
        return "bg-blue-500 text-white hover:bg-blue-600";
    }
  };

  return (
    <Link href={`/jugadores/${player.idPlayer}`}>
      <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-2 border-gray-100 cursor-pointer">
        <CardContent className="p-6">
          {/* Position Badge */}
          <div className="flex justify-center mb-4">
            <Badge
              className={`text-lg px-4 py-2 font-bold transition-colors duration-300 ${getPositionBadgeColor(
                player.position
              )}`}
            >
              #{player.position}
            </Badge>
          </div>

          {/* Player Avatar */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <OptimizedAvatar
                src={player.photo}
                alt={`${player.name} ${player.lastname}`}
                size="large"
                className="w-32 h-32 border-4 border-gray-200 group-hover:border-blue-400 transition-colors duration-300"
                fallbackText={`${player.name.charAt(0)}${player.lastname.charAt(0)}`}
                priority={player.position <= 4} // Prioridad para los primeros 4
              />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Player Info */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
              {player.name} {player.lastname}
            </h3>
            
            {/* Points */}
            <div className="text-lg font-semibold text-blue-600">
              {player.points} pts
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="bg-green-50 rounded-lg p-2">
                <div className="text-lg font-bold text-green-600">{player.wonMatches}</div>
                <div className="text-xs text-gray-600">Ganados</div>
              </div>
              <div className="bg-red-50 rounded-lg p-2">
                <div className="text-lg font-bold text-red-600">{player.lostMatches}</div>
                <div className="text-xs text-gray-600">Perdidos</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-2">
                <div className="text-lg font-bold text-blue-600">{player.playedMatches}</div>
                <div className="text-xs text-gray-600">Jugados</div>
              </div>
            </div>

            {/* Sets difference indicator */}
            <div className="mt-3">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                player.setsDifference > 0 
                  ? 'bg-green-100 text-green-800' 
                  : player.setsDifference < 0 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-gray-100 text-gray-800'
              }`}>
                {player.setsDifference > 0 && '+'}
                {player.setsDifference} sets
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}