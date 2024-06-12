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

function ProfilePlayer() {
  const params = useParams();
  const idParam = params.id;
  const [player, setPlayer] = useState<User>();
  const currentUser = player?.name + " " + player?.lastname;
  const idUser = Number(idParam);
  const userRepository = useMemo(() => createApiUserRepository(), []);
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
    getMatchesByUser,
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

  const loadUser = useCallback(
    (id: number) => getUser(userRepository)(id),
    [userRepository]
  );

  useEffect(() => {
    const fetchUserAndMatches = async () => {
      try {
        const userData = await loadUser(idUser);
        setPlayer(userData);
        await getMatchesByUser(idUser);
        await fetchAllDataForPlayer(idUser);
        await getTotalPlayerMatchSummary(idUser);
        await getTotalPlayerSetSummary(idUser);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserAndMatches();
  }, [idUser, loadUser, getMatchesByUser, fetchAllDataForPlayer]);

  useEffect(() => {
    const fetchNextMatch = async () => {
      try {
        if (currentTournaments && currentTournaments.id) {
          const activeTournamentId = currentTournaments.id;
          await getNextMatch(activeTournamentId, idUser);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (!isTournamentLoading && currentTournaments) {
      fetchNextMatch();
    }
  }, [idUser, currentTournaments, getNextMatch, isTournamentLoading]);

  console.log(setSummary, "setSummary")

  if (isTournamentLoading || isMatchLoading || isLoadingSets) {
    return <Loading isLoading />;
  }

  return (
    <>
      <PlayerComponent
        player={player}
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
