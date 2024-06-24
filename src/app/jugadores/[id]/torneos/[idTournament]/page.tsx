"use client";
import React, { useEffect, useState } from "react";
import MatchesByTournamentPlayer from "@/sections/Tournament/ByPlayer/matches";
import ChartRankingByPlayer from "@/sections/Tournament/ByPlayer/ranking";
import StatisticsByPlayer from "@/sections/Tournament/ByPlayer/statistics";
import { useTournamentCategoryStore } from "@/hooks/useTournamentCategory";
import { useParams } from "next/navigation";
import { useMatchStore } from "@/hooks/useMatch";
import { useTournamentRankingStore } from "@/hooks/useTournamentRanking";
import { useTournamentStore } from "@/hooks/useTournament";
import { formatDate } from "@/lib/utils";
import { formatTournamentDates } from "@/common/helpers/helpers";

function TournamentPlayerPage() {
  const { id, idTournament } = useParams();
  const { getTournamentCategoriesByUser, categoriesForTournaments } =
    useTournamentCategoryStore();
  const {
    getTotalPlayerTournamentMatchSummary,
    playerMatchSummary,
    getHistoryRanking,
    historyRanking,
  } = useTournamentRankingStore();
  const { getTournament, tournament } = useTournamentStore();
  const { getMatchesByUser, matches } = useMatchStore();
  const idUser = Number(id);

  const [categories, setCategories] = useState("");
  useEffect(() => {
    if (idUser) {
      getTournamentCategoriesByUser(idUser);
      getTournament(Number(idTournament));
    }
  }, [getTournamentCategoriesByUser, idUser]);

  useEffect(() => {
    if (categoriesForTournaments.length > 0) {
      const matchingTournament = categoriesForTournaments.find(
        (category) => category.tournament.id === Number(idTournament)
      );

      if (matchingTournament) {
        getMatchesByUser(
          idUser,
          matchingTournament.tournament.id,
          matchingTournament.category.id
        );
        getTotalPlayerTournamentMatchSummary(
          idUser,
          matchingTournament.tournament.id,
          matchingTournament.category.id
        );
        getHistoryRanking(
          idUser,
          matchingTournament.tournament.id,
          matchingTournament.category.id
        );
        setCategories(matchingTournament.category.name);
      } else {
        console.log("Tournament ID does not match any category.");
      }
    }
  }, [categoriesForTournaments, idTournament]);

  const validPositions = historyRanking.filter(
    (ranking) => ranking.position !== null
  );
  const bestPosition = Math.min(
    ...validPositions.map((ranking) => ranking.position)
  );

  return (
    <div className="grid gap-6 container mt-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">{tournament?.name}</h1>
        <p className="text-muted-foreground">
          {formatTournamentDates(
            String(tournament?.startedAt),
            String(tournament?.finishedAt)
          )}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MatchesByTournamentPlayer matches={matches} />
        <ChartRankingByPlayer historyRanking={historyRanking} />
      </div>
      <StatisticsByPlayer
        matchSummary={playerMatchSummary}
        category={categories}
        initialPosition={historyRanking[0]?.position || 0}
        bestPosition={bestPosition}
      />
    </div>
  );
}

export default TournamentPlayerPage;
