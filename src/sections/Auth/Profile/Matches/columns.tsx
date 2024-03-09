"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Match } from "@/modules/match/domain/Match";
import { Button } from "@/components/ui/button";
import { Sets } from "@/modules/sets/domain/Sets";
import { IoTimeOutline } from "react-icons/io5";
import DeleteMatchDialog from "./Delete/button";
import AddResultMatchDialog from "./AddResult/dialog";
import EditMatchDialog from "./Time/dialog";
import { formatDate } from "@/lib/utils";
export const getColumns = (onUpdateMatches: () => void): ColumnDef<Match>[] => {
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
      header: "Día y Hora",
      cell: ({ row }) => {
        if (row.original.shift === null) {
          return (
            <span className="px-3 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"></span>
          );
        }
        return (
          <div className="flex items-center">
            {formatDate(row.original.shift.startHour)}
          </div>
        );
      },
    },
    {
      header: "Cancha",
      cell: ({ row }) => {
        if (row.original.shift === null) {
          return (
            <span className="px-3 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"></span>
          );
        }
        return (
          <div className="flex items-center">
            {row.original.shift.court?.name}
          </div>
        );
      },
    },
    {
      header: "Resultado",
      cell: ({ row }) => {
        if (row.original.status === "pending") {
          return (
            <span className="px-3 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"></span>
          );
        }
        return (
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
        );
      },
    },
    {
      header: "Estado",
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.status === "played" ? (
            <span className="px-3 inline-flex text-xs leading-5 font-bold rounded-full bg-green-600 text-gray-800">
              Jugado
            </span>
          ) : (
            <span className="px-3 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-500 text-gray-900">
              Pendiente
            </span>
          )}
        </div>
      ),
    },
    {
      header: " ",
      cell: ({ row }) => (
        <div className="flex items-center justify-end space-x-1">
          {row.original.status !== "played" && (
            <>
              <AddResultMatchDialog
                match={row.original}
                onUpdateMatches={onUpdateMatches}
              />
              {row.original.shift ? null : (
                <EditMatchDialog
                  match={row.original}
                  onUpdateMatches={onUpdateMatches}
                />
              )}
              {/* <DeleteMatchDialog /> */}
            </>
          )}
        </div>
      ),
    },
  ];

  return columns;
};
