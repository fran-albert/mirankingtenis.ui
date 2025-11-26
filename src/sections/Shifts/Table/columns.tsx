"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Match } from "@/types/Match/Match";
import { formatDateComplete } from "@/lib/utils";
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
      accessorKey: "match",
      header: () => <div className="w-36 text-center">Partido</div>,
      cell: ({ row }) => {
        const user1 = row.original.user1;
        const user2 = row.original.user2;
        const player1Name = user1 ? `${user1.name?.charAt(0) || "?"}. ${user1.lastname || "???"}` : "???";
        const player2Name = user2 ? `${user2.name?.charAt(0) || "?"}. ${user2.lastname || "???"}` : "???";
        return (
          <div className="w-36 text-center">
            {player1Name} vs {player2Name}
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: () => <div className="w-32 text-center">Fecha</div>,
      cell: ({ row }) => (
        <div className="w-32 h-20 text-center">
          {row.original.shift?.startHour
            ? formatDateComplete(row.original.shift.startHour)
            : "Sin fecha"}
        </div>
      ),
    },
    {
      accessorKey: "court",
      header: () => <div className="w-10 text-center">Cancha</div>,
      cell: ({ row }) => {
        const court = row.original.shift?.court;
        let courtName = "Sin cancha";
        if (court) {
          courtName = typeof court === "string" ? court : (court.name || "Sin cancha");
        }
        return (
          <div className="w-10 text-center">
            {courtName}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Estado</div>,
      cell: ({ row }) => (
        <div className="text-center">
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
