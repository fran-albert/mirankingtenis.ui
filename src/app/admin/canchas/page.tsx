"use client";
import Loading from "@/components/Loading/loading";
import { useCustomSession } from "@/context/SessionAuthProviders";
import useRoles from "@/hooks/useRoles";
import { getAllCategories } from "@/modules/category/application/get-all/getAllCategories";
import { Category } from "@/modules/category/domain/Category";
import { createApiCategoryRepository } from "@/modules/category/infra/ApiCategoryRepository";
import { getAll } from "@/modules/court/application/get-all/getAllCourt";
import { Court } from "@/modules/court/domain/Court";
import { createApiCourtRepository } from "@/modules/court/infra/ApiCourtRepository";
import { getAdminUsers } from "@/modules/users/application/get-all-admin/getAdminUsers";
import { User } from "@/types/User/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import CategoriesTable from "@/sections/Admin/Categories/Table/table";
import CourtTable from "@/sections/Admin/Courts/Table/table";
import AdminPlayersTanstackTable from "@/sections/Admin/Players/Table/tanstack";
import { PlayersTable } from "@/sections/Players/Table/table";
import React, { useCallback, useEffect, useMemo, useState } from "react";

function CourtPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [courts, setCourts] = useState<Court[]>([]);
  const courtRepository = useMemo(() => createApiCourtRepository(), []);
  const loadAllCourts = useCallback(async () => {
    const users = await getAll(courtRepository)();
    return users;
  }, [courtRepository]);
  const { isAdmin } = useRoles();
  const { session } = useCustomSession();
  const canAddUser = !!session && isAdmin;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const courtData = await loadAllCourts();
        setCourts(courtData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [loadAllCourts]);

  const handlePlayerDeleted = (idPlayer: number) => {
    setCourts((currentPlayers) =>
      currentPlayers.filter((player) => player.id !== idPlayer)
    );
  };

  const addCourtToList = (newCourt: Court) => {
    setCourts((currentCourts) => [...currentCourts, newCourt]);
  };

  const removeCourtFromList = (idCourt: number) => {
    setCourts((currentCourts) =>
      currentCourts.filter((court) => Number(court.id) !== idCourt)
    );
  };
  if (isLoading) {
    return <Loading isLoading={true} />;
  }

  return (
    <div>
      <CourtTable
        courts={courts}
        addCourtToList={addCourtToList}
        removeCourtFromList={removeCourtFromList}
      />
    </div>
  );
}

export default CourtPage;
