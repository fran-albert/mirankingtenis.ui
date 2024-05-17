"use client";
import Loading from "@/components/Loading/loading";
import { useCustomSession } from "@/context/SessionAuthProviders";
import useRoles from "@/hooks/useRoles";
import { getAllCategories } from "@/modules/category/application/get-all/getAllCategories";
import { Category } from "@/modules/category/domain/Category";
import { createApiCategoryRepository } from "@/modules/category/infra/ApiCategoryRepository";
import { getAllTournaments } from "@/modules/tournament/application/get-all-tournaments/getAllTournaments";
import { Tournament } from "@/modules/tournament/domain/Tournament";
import { createApiTournamentRepository } from "@/modules/tournament/infra/ApiTournamentRepository";
import { getAdminUsers } from "@/modules/users/application/get-all-admin/getAdminUsers";
import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import CategoriesTable from "@/sections/Admin/Categories/Table/table";
import AdminPlayersTanstackTable from "@/sections/Admin/Players/Table/tanstack";
import TournamentTable from "@/sections/Admin/Tournament/Table/table";
import { PlayersTable } from "@/sections/Players/Table/table";
import React, { useCallback, useEffect, useMemo, useState } from "react";

function TournamentPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [tournament, setTournament] = useState<Tournament[]>([]);
  const tournamentRepository = useMemo(() => createApiTournamentRepository(), []);
  const loadAllTournament = useCallback(async () => {
    const tournaments = await getAllTournaments(tournamentRepository)();
    return tournaments;
  }, [tournamentRepository]);
  const { isAdmin } = useRoles();
  const { session } = useCustomSession();
  const canAddUser = !!session && isAdmin;

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setIsLoading(true);
        const tournamentData = await loadAllTournament();
        setTournament(tournamentData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTournaments();
  }, [loadAllTournament]);

  const addTournamentToList = (newTournament: Tournament) => {
    setTournament((currentTournaments) => [
      ...currentTournaments,
      newTournament,
    ]);
  };

  if (isLoading) {
    return <Loading isLoading={true} />;
  }

  return (
    <div>
      <TournamentTable
        tournament={tournament}
        addTournamentToList={addTournamentToList}
      />
    </div>
  );
}

export default TournamentPage;
