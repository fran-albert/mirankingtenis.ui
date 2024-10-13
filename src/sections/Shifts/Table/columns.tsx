"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Match } from "@/modules/match/domain/Match";
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
      cell: ({ row }) => (
        <div className="w-36 text-center">
          {row.original.user1.lastname} vs {row.original.user2.lastname}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: () => <div className="w-32 text-center">Fecha</div>,
      cell: ({ row }) => (
        <div className="w-32 h-20 text-center">
          {formatDateComplete(row.original.shift.startHour)}
        </div>
      ),
    },
    {
      accessorKey: "court",
      header: () => <div className="w-10 text-center">Cancha</div>,
      cell: ({ row }) => (
        <div className="w-10 text-center">
          {typeof row.original.shift.court === "string"
            ? row.original.shift.court
            : row.original.shift.court.name}
        </div>
      ),
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
