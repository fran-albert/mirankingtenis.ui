"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditButton } from "@/components/Button/Edit/button";
import { User } from "@/modules/users/domain/User";
import { Button } from "@/components/ui/button";
import { Match } from "@/modules/match/domain/Match";
import { formatDate, formatDateComplete } from "@/lib/utils";
import { BadgeWin } from "@/components/Badge/Green/badge";
import { BadgePending } from "@/components/Badge/Pending/badge";

export const getColumns = (totalRows: number): ColumnDef<Match>[] => {
  const columns: ColumnDef<Match>[] = [
    {
      accessorKey: "#",
      header: "#",
      cell: ({ row }) => {
        const reverseIndex = totalRows - row.index;
        return <div>{reverseIndex}</div>;
      },
      size: 100,
    },
    {
      header: "Partido",
      cell: ({ row }) => (
        <div className="w-36">
          {row.original.user1.lastname} vs {row.original.user2.lastname}
        </div>
      ),
    },
    {
      header: "Fecha",
      cell: ({ row }) => (
        <div className="w-32">{formatDate(row.original.shift.startHour)}</div>
      ),
    },
    {
      header: "Cancha",
      cell: ({ row }) => (
        <div className="w-10">{row.original.shift.court.name}</div>
      ),
    },
    {
      header: "Estado",
      cell: ({ row }) => (
        <div>
          {row.original.status === "pending" ? (
            <span className="ml-2 text-sm font-semibold ">
              <BadgePending text="Pendiente" />
            </span>
          ) : (
            <span className="ml-2 text-sm font-semibold ">
              <BadgeWin text="Finalizado" />
            </span>
          )}
        </div>
      ),
    },
  ];

  return columns;
};
