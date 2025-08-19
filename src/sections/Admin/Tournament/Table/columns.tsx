"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EditButton } from "@/components/Button/Edit/button";
import { Button } from "@/components/ui/button";
import DeletePlayerDialog from "@/sections/Players/Delete/button";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tournament } from "@/types/Tournament/Tournament";
import { TournamentStatus } from "@/common/enum/tournamentStatus.enum";
import { ViewButton } from "@/components/Button/View/button";
import StartTournamentDialog from "../Start/dialog";
import FinishTournamentDialog from "../Finish/dialog";

export const getColumns = (
  handlePlayerDeleted: (idPlayer: number) => void,
  updateTournamentOnList: (newTournament: Tournament) => void,
  roles: { isAdmin: boolean | undefined }
): ColumnDef<Tournament>[] => {
  const columns: ColumnDef<Tournament>[] = [
    {
      accessorKey: "#",
      header: "#",
      cell: ({ row }) => {
        const index = row.index;
        return <div>{index + 1}</div>;
      },
    },
    {
      accessorKey: "name",
      header: "Torneo",
      cell: ({ row }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => {
            window.location.href = `/admin/torneos/${row.original.id}`;
          }}
        >
          <div className="flex flex-col ml-2">
            <p className="text-sm font-medium">{row.original.name}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Tipo",
      cell: ({ row }) => (
        <div>{row.original.type === "master" ? "Master" : "Liga"}</div>
      ),
    },
    {
      header: "Creado",
      cell: ({ row }) => (
        <div>
          {row.original.createdAt
            ? formatDate(row.original.createdAt)
            : "Error en la fecha"}
        </div>
      ),
    },
    {
      header: "Empezado",
      cell: ({ row }) => (
        <div>
          {row.original.startedAt ? formatDate(row.original.startedAt) : ""}
        </div>
      ),
    },
    {
      header: "Finalizado",
      cell: ({ row }) => (
        <div>
          {row.original.finishedAt ? formatDate(row.original.finishedAt) : ""}
        </div>
      ),
    },
    {
      header: "Estado",
      cell: ({ row }) => (
        <div>
          {
            <Badge
              variant={
                row.original.status === TournamentStatus.pending
                  ? TournamentStatus.pending
                  : row.original.status === TournamentStatus.finished
                  ? TournamentStatus.finished
                  : TournamentStatus.started
              }
              className="text-black"
            >
              {row.original.status === TournamentStatus.pending
                ? "Pendiente"
                : row.original.status === "finished"
                ? "Finalizado"
                : "Empezado"}
            </Badge>
          }
        </div>
      ),
    },
    {
      header: " ",
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            {row.original.status === TournamentStatus.pending ? (
              <StartTournamentDialog
                tournament={row.original}
                onUpdateTournamentOnList={updateTournamentOnList}
              />
            ) : row.original.status === TournamentStatus.ongoing ? (
              <FinishTournamentDialog
                tournament={row.original}
                onUpdateTournamentOnList={updateTournamentOnList}
              />
            ) : null}
          </div>
        </div>
      ),
    },
  ];

  return columns;
};
