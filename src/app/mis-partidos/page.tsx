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
  const idUser = session?.user.id as number;
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
    console.log("useEffect triggered");
    setIsLoading(true);
    const fetchUserAndMatches = async () => {
      try {
        console.log("Fetching data");
        const userData = await loadUser(idUser);
        console.log("User data fetched", userData);
        setUser(userData);
        const userMatches = await loadMatches(idUser);
        console.log("Matches fetched", userMatches);
        setMatches(userMatches);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
        console.log("Finished fetching data");
      }
    };
    fetchUserAndMatches();
  }, [idUser, loadMatches, loadUser]);

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
        <AutoSignOut />
        <MatchesIndex match={matches} onUpdateMatches={updateMatches} />
      </div>
    </div>
  );
}

export default MyMatchesPage;
