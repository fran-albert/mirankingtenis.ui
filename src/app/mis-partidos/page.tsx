"use client";
import Loading from "@/components/Loading/loading";
import AutoSignOut from "@/components/autoSignOut";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { getMatchesByUser } from "@/modules/match/application/get-by-user/getMatchesByUser";
import { Match } from "@/modules/match/domain/Match";
import { createApiMatchRepository } from "@/modules/match/infra/ApiMatchRepository";
import { getUser } from "@/modules/users/application/get/getUser";
import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import MatchesIndex from "@/sections/Auth/Profile/Matches";
import React, { useEffect, useMemo, useState } from "react";

function MyMatchesPage() {
  const { session } = useCustomSession();
  let idUser = session?.user?.id;
  idUser = Number(idUser);
  const isValidIdUser = !isNaN(idUser) && idUser > 0;
  const [user, setUser] = useState<User>();
  const userRepository = useMemo(() => createApiUserRepository(), []);
  const matchRepository = useMemo(() => createApiMatchRepository(), []);

  const [matches, setMatches] = useState<Match[]>([]);
  const loadMatches = useMemo(
    () => getMatchesByUser(matchRepository),
    [matchRepository]
  );
  const loadUser = useMemo(() => getUser(userRepository), [userRepository]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    if (isValidIdUser) {
      setIsLoading(true);
      const fetchUserAndMatches = async () => {
        try {
          const userData = await loadUser(Number(idUser));
          setUser(userData);
          const userMatches = await loadMatches(Number(idUser));
          setMatches(userMatches);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserAndMatches();
    } else {
      console.error("ID de usuario no válido:", idUser);
    }
  }, [idUser, loadMatches, loadUser]);

  if (isLoading) {
    return <Loading isLoading />;
  }

  const updateMatches = async () => {
    const userMatches = await loadMatches(Number(idUser));
    setMatches(userMatches);
  };

  return (
    <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
      <div className="w-full max-w-7xl space-y-6">
        <AutoSignOut />
        <MatchesIndex match={matches} onUpdateMatches={updateMatches} />
      </div>
    </div>
  );
}

export default MyMatchesPage;
