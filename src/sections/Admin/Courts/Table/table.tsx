"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/Table/dataTable";
import { getColumns } from "./columns";
import useRoles from "@/hooks/useRoles";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { Category } from "@/modules/category/domain/Category";
import { Court } from "@/modules/court/domain/Court";
import AddCourtDialog from "../Add/dialog";

function CourtTable({
  courts,
  addCourtToList,
  removeCourtFromList,
}: {
  courts: Court[];
  addCourtToList: (newCourt: Court) => void;
  removeCourtFromList: (idCourt: number) => void;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useRoles();
  const { session } = useCustomSession();
  const canAddUser = !!session && isAdmin;
  const [isAddSpecialityDialogOpen, setIsAddSpecialityDialogOpen] =
    useState(false);

  const openAddCategoryDialog = () => setIsAddSpecialityDialogOpen(true);

  const courtsColumn = getColumns(removeCourtFromList, { isAdmin });
  const customFilterFunction = (player: Category, query: string) =>
    player.name.toLowerCase().includes(query.toLowerCase());

  return (
    <>
      <DataTable
        columns={courtsColumn}
        data={courts}
        searchPlaceholder="Buscar canchas..."
        showSearch={true}
        addLinkPath=""
        onAddClick={openAddCategoryDialog}
        customFilter={customFilterFunction}
        addLinkText="Agregar Cancha"
        canAddUser={canAddUser}
      />
      <AddCourtDialog
        isOpen={isAddSpecialityDialogOpen}
        setIsOpen={setIsAddSpecialityDialogOpen}
        onCourtAdded={addCourtToList}
      />
    </>
  );
}

export default CourtTable;
