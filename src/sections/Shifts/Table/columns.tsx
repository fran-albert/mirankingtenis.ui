"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditButton } from "@/components/Button/Edit/button";
import { User } from "@/modules/users/domain/User";
import { Button } from "@/components/ui/button";
import { Match } from "@/modules/match/domain/Match";
import { formatDate, formatDateComplete } from "@/lib/utils";

export const getColumns = (): ColumnDef<Match>[] => {
  const columns: ColumnDef<Match>[] = [
    {
      accessorKey: "#",
      header: "#",
      cell: ({ row }) => {
        const index = row.index;
        return <div>{index + 1}</div>;
      },
    },
    {
      header: "Partido",
      cell: ({ row }) => (
        <div>
          {row.original.user1.lastname} vs {row.original.user2.lastname}
        </div>
      ),
    },
    {
      header: "Fecha",
      cell: ({ row }) => (
        <div>{formatDateComplete(row.original.shift.startHour)}</div>
      ),
    },
    {
      header: "Estado",
      cell: ({ row }) => (
        <div>
          {row.original.status === "pending" ? "Pendiente" : "Finalizado"}
        </div>
      ),
    },
  ];

  return columns;
};
