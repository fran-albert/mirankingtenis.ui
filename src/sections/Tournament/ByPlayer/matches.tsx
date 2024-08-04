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
import { Match } from "@/modules/match/domain/Match";
function MatchesByTournamentPlayer({ matches }: { matches: Match[] }) {
  const getMatchStageText = (match: Match) => {
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
                  <TableCell>{match.finalResult}</TableCell>
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
