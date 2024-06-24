"use client";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Loading from "@/components/Loading/loading";
import { useTournamentStore } from "@/hooks/useTournament";
import { useMatchStore } from "@/hooks/useMatch";
import { useTournamentRankingStore } from "@/hooks/useTournamentRanking";
import { useSetsStore } from "@/hooks/useSet";
import { useUserStore } from "@/hooks/useUser";
import { PlayerComponent } from "@/sections/Players/Component/player-component";
function PlayerDetailsPage() {
  const params = useParams();
  const idParam = params.id;
  const idUser = Number(idParam);
  const {
    fetchAllDataForPlayer,
    currentTournaments,
    allTournaments,
    completedTournaments,
    getCompletedTournamentsByPlayer,
    playerInfo,
    loading: isTournamentLoading,
  } = useTournamentStore();
  const { playerMatchSummary, getTotalPlayerMatchSummary } =
    useTournamentRankingStore();
  const {
    getAllMatchesByUser,
    matches,
    nextMatch,
    getNextMatch,
    loading: isMatchLoading,
  } = useMatchStore();
  const {
    getTotalPlayerSetSummary,
    setSummary,
    loading: isLoadingSets,
  } = useSetsStore();
  const { loading: isLoadingUser, getUser, user } = useUserStore();
  const [loading, setLoading] = useState(true);
  const currentUser = user?.name + " " + user?.lastname;

  useEffect(() => {
    const fetchUserAndMatches = async () => {
      try {
        setLoading(true);
        await getUser(idUser);
        await Promise.all([
          getAllMatchesByUser(idUser),
          fetchAllDataForPlayer(idUser),
          getCompletedTournamentsByPlayer(idUser),
          getTotalPlayerMatchSummary(idUser),
          getTotalPlayerSetSummary(idUser),
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchUserAndMatches();
  }, [
    idUser,
    getUser,
    getAllMatchesByUser,
    fetchAllDataForPlayer,
    getTotalPlayerMatchSummary,
    getTotalPlayerSetSummary,
  ]);

  useEffect(() => {
    const fetchNextMatch = async () => {
      try {
        setLoading(true);
        if (currentTournaments && currentTournaments.id) {
          const activeTournamentId = currentTournaments.id;
          await getNextMatch(activeTournamentId, idUser);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching next match:", error);
      }
    };

    if (!isTournamentLoading && currentTournaments) {
      fetchNextMatch();
    }
  }, [idUser, currentTournaments, getNextMatch, isTournamentLoading]);

  if (isLoadingUser || isMatchLoading || isLoadingSets || isTournamentLoading) {
    return <Loading isLoading />;
  }

  return (
    <div className="flex flex-col justify-center container mx-auto px-4 sm:px-6 lg:px-8">
      <PlayerComponent
        player={user}
        setSummary={setSummary}
        currentUser={currentUser}
        matchSummary={playerMatchSummary}
        nextMatch={nextMatch}
        matches={matches}
        currentTournaments={currentTournaments}
        allTournaments={allTournaments}
        completedTournaments={completedTournaments}
        playerInfo={playerInfo}
      />
    </div>
  );
}

export default PlayerDetailsPage;
