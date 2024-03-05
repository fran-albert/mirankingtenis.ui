"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Match } from "@/modules/match/domain/Match";
import { Button } from "@/components/ui/button";
import { Sets } from "@/modules/sets/domain/Sets";
import EditMatchDialog from "./Edit/dialog";

export const getColumns = (
  onUpdateMatches: () => void,
  ): ColumnDef<Match>[] => {
  const columns: ColumnDef<Match>[] = [
    {
      header: "Fecha",
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="flex flex-col ml-2">
            <p className="text-sm font-medium">
              {row.original.fixture?.jornada}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Rival",
      cell: ({ row }) => <div>{row.original.rivalName}</div>,
    },
    {
      header: "Resultado",
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.finalResult}
          {row.original.sets.map((set, index) => (
            <div className="m-2" key={index}>
              <span className="player-scores">{set.pointsPlayer1}</span>
              <span className="player-scores">-</span>
              <span className="player-scores">{set.pointsPlayer2}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      header: "Estado",
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.status === "pending" ? (
            <span className="px-3 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
              Pendiente
            </span>
          ) : row.original.status === "played" ? (
            <span className="px-3 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800">
              Jugado
            </span>
          ) : (
            <span className="px-3 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
              Cancelado
            </span>
          )}
        </div>
      ),
    },
    {
      header: " ",
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          {row.original.status === "pending" ? (
            <EditMatchDialog
              match={row.original}
              onUpdateMatches={onUpdateMatches}
            />
          ) : (
            <Button className="mr-2" onClick={() => console.log(row.original)}>
              Ver
            </Button>
          )}
        </div>
      ),
    },
  ];

  return columns;
};
