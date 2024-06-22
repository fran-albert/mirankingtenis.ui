import { getUser } from "@/modules/users/application/get/getUser";
import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Loading from "@/components/Loading/loading";
import { PlayerComponent } from "../Component/player-component";
import { useTournamentStore } from "@/hooks/useTournament";
import { useMatchStore } from "@/hooks/useMatch";
import { useTournamentRankingStore } from "@/hooks/useTournamentRanking";
import { useSetsStore } from "@/hooks/useSet";
import { useUserStore } from "@/hooks/useUser";

function ProfilePlayer() {
  const params = useParams();
  const idParam = params.id;
  const idUser = Number(idParam);
  const {
    fetchAllDataForPlayer,
    currentTournaments,
    allTournaments,
    completedTournaments,
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

  if (isTournamentLoading || isMatchLoading || isLoadingSets || isLoadingUser) {
    return <Loading isLoading />;
  }

  return (
    <>
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
    </>
  );
}

export default ProfilePlayer;
