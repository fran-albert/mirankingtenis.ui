"use client";
import Loading from "@/components/Loading/loading";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { getMatchesByUser } from "@/modules/match/application/get-by-user/getMatchesByUser";
import { Match } from "@/modules/match/domain/Match";
import { createApiMatchRepository } from "@/modules/match/infra/ApiMatchRepository";
import { getUser } from "@/modules/users/application/get/getUser";
import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import MatchesIndex from "@/sections/Auth/Profile/Matches";
import React, { useEffect, useState } from "react";

function MyMatchesPage() {
  const { session } = useCustomSession();
  const idUser = session?.user.id as number;
  const [user, setUser] = useState<User>();
  const userRepository = createApiUserRepository();
  const [matches, setMatches] = useState<Match[]>([]);
  const matchRepository = createApiMatchRepository();
  const loadMatches = getMatchesByUser(matchRepository);
  const loadUser = getUser(userRepository);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchUserAndMatches = async () => {
      try {
        const userData = await loadUser(idUser);
        setUser(userData);
        const userMatches = await loadMatches(idUser);
        setMatches(userMatches);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserAndMatches();
  }, [idUser]);

  if (isLoading) {
    return <Loading isLoading />;
  }

  const updateMatches = async () => {
    const userMatches = await loadMatches(idUser);
    setMatches(userMatches);
  };

  return (
    <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
      <div className="w-full max-w-7xl space-y-6">
        <MatchesIndex match={matches} onUpdateMatches={updateMatches} />
      </div>
    </div>
  );
}

export default MyMatchesPage;
