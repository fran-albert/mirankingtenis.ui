"use client";
import Loading from "@/components/Loading/loading";
import { useCustomSession } from "@/context/SessionAuthProviders";
import useRoles from "@/hooks/useRoles";
import { Category } from "@/types/Category/Category";
import { getAll } from "@/modules/court/application/get-all/getAllCourt";
import { Court } from "@/modules/court/domain/Court";
import { createApiCourtRepository } from "@/modules/court/infra/ApiCourtRepository";
import CategoriesTable from "@/sections/Admin/Categories/Table/table";
import CourtTable from "@/sections/Admin/Courts/Table/table";
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
