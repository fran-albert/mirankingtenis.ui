"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { User } from "@/types/User/User";
import { DataTable } from "@/components/Table/dataTable";
import { getColumns } from "./columns";
import useRoles from "@/hooks/useRoles";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { Category } from "@/modules/category/domain/Category";
import { Tournament } from "@/modules/tournament/domain/Tournament";
import AddTournamentDialog from "../Add/dialog";

function TournamentTable({
  tournament,
  addTournamentToList,
  onUpdateTournamentOnList,
}: {
  tournament: Tournament[];
  addTournamentToList: (newTournament: Tournament) => void;
  onUpdateTournamentOnList: (updatedTournament: Tournament) => void;
}) {
  const { isAdmin } = useRoles();
  const { session } = useCustomSession();
  const canAddUser = !!session && isAdmin;
  const [isAddTournamentDialogOpen, setIsAddTournamentDialogOpen] =
    useState(false);

  const openAddTournamentDialog = () => setIsAddTournamentDialogOpen(true);
  const handlePlayerDeleted = (idPlayer: number) => {
    (currentPlayers: User[]) =>
      currentPlayers.filter((player) => player.id !== idPlayer);
  };

  const columns = getColumns(handlePlayerDeleted, onUpdateTournamentOnList, {
    isAdmin,
  });
  const customFilterFunction = (player: Category, query: string) =>
    player.name.toLowerCase().includes(query.toLowerCase());

  return (
    <div>
      <DataTable
        columns={columns}
        data={tournament}
        searchPlaceholder="Buscar torneos..."
        showSearch={true}
        addLinkPath=""
        customFilter={customFilterFunction}
        onAddClick={openAddTournamentDialog}
        addLinkText="Agregar Torneo"
        canAddUser={canAddUser}
      />
      <AddTournamentDialog
        isOpen={isAddTournamentDialogOpen}
        setIsOpen={setIsAddTournamentDialogOpen}
        addTournamentToList={addTournamentToList}
      />
    </div>
  );
}

export default TournamentTable;
