import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { MatchByUserWithRival } from "@/types/Match/MatchByUser.dto";
function MatchesByTournamentPlayer({ matches }: { matches: MatchByUserWithRival[] }) {
  const getMatchStageText = (match: MatchByUserWithRival) => {
    if (match.fixture?.jornada) {
      return match.fixture.jornada;
    }

    switch (match.playoff?.roundType) {
      case "QuarterFinals":
        return "Cuartos de Final";
      case "SemiFinals":
        return "Semifinal";
      case "Final":
        return "Final";
      default:
        return match.playoff?.roundType;
    }
  };

  const getMatchStatusText = (finalResult: any) => {
    switch (finalResult) {
      case "pending":
        return "Pendiente";
      case "Victoria":
        return "Victoria";
      case "Derrota":
        return "Derrota";
      case "played":
        return "Jugado";
      default:
        return finalResult;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Historial de Partidos</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Rival</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((match, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {match.fixture
                      ? match.fixture.jornada
                      : getMatchStageText(match)}
                  </TableCell>
                  <TableCell>{match.rivalName}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      match.finalResult === 'Victoria' ? 'bg-green-100 text-green-800' :
                      match.finalResult === 'Derrota' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getMatchStatusText(match.finalResult)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      {match.sets.map((set, index) => (
                        <div className="m-2" key={index}>
                          <span className="player-scores">
                            {set.pointsPlayer1}
                          </span>
                          <span className="player-scores">-</span>
                          <span className="player-scores">
                            {set.pointsPlayer2}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

export default MatchesByTournamentPlayer;
