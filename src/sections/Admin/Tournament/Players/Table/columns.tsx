"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditButton } from "@/components/Button/Edit/button";
import { User } from "@/types/User/User";
import { Button } from "@/components/ui/button";
import DeletePlayerDialog from "@/sections/Players/Delete/button";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TournamentParticipant } from "@/modules/tournament-participant/domain/TournamentParticipant";
import DesactivatePlayerDialog from "../Desactivate/button";

export const getColumns = (
  handlePlayerDesactivated: (idPlayer: number) => void,
  roles: { isAdmin: boolean | undefined }
): ColumnDef<TournamentParticipant>[] => {
  const columns: ColumnDef<TournamentParticipant>[] = [
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
      header: "Jugador",
      cell: ({ row }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() =>
            (window.location.href = `/admin/jugadores/${row.original.id}`)
          }
        >
          <div className="flex flex-col ml-2">
            <p className="text-sm font-medium">
              {row.original.lastname}, {row.original.name}
            </p>
          </div>
        </div>
      ),
    },

    {
      header: "Estado",
      cell: ({ row }) => (
        <div>
          {
            <Badge
              variant={row.original.isActive ? "success" : "destructive"}
              className="text-gray-200"
            >
              {row.original.isActive ? "Activo" : "Inactivo"}
            </Badge>
          }
        </div>
      ),
    },
    {
      header: " ",
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          {roles.isAdmin && (
            <div className="flex items-center gap-2">
              <DesactivatePlayerDialog
                idPlayer={row.original.idPlayer}
                handlePlayerDesactivated={handlePlayerDesactivated}
              />
            </div>
          )}
        </div>
      ),
    },
  ];

  return columns;
};
