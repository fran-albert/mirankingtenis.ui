"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Sets } from "@/modules/sets/domain/Sets";
import { IoTimeOutline } from "react-icons/io5";
import DeleteMatchDialog from "./Delete/button";
import AddResultMatchDialog from "./AddResult/dialog";
import EditMatchDialog from "./Time/dialog";
import { formatDate, formatDateComplete } from "@/lib/utils";
import UpdateShiftDialog from "./EditTime/dialog";
import { Match } from "@/modules/match/domain/Match";
import { BadgeWin } from "@/components/Badge/Green/badge";
import { BadgePending } from "@/components/Badge/Pending/badge";
import DeleteShiftDialog from "./DeleteShift/dialog";
export const getColumns = (onUpdateMatches: () => void): ColumnDef<Match>[] => {
  const columns: ColumnDef<Match>[] = [
    {
      header: "Fecha",
      cell: ({ row }) => (
        <p className="text-sm font-medium text-center">
          {row.original.fixture?.jornada}
        </p>
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
            <span className="px-3 inline-flex text-xs w-16 leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"></span>
          );
        }
        return (
          <div className="flex items-center w-48">
            {formatDateComplete(row.original.shift.startHour)} hs
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
          <p className="text-sm text-center">
            {row.original.shift.court?.name}
          </p>
        );
      },
    },
    {
      header: "Resultado",
      cell: ({ row }) => {
        if (row.original.status === "pending") {
          return (
            <span className="px-3 inline-flex text-xs leading-5 w-48 font-semibold rounded-full bg-yellow-100 text-yellow-800"></span>
          );
        }
        return (
          <div className="flex items-center w-48">
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
            <span className="ml-2 text-sm font-semibold ">
              <BadgeWin text="Jugado" />
            </span>
          ) : (
            <span className="ml-2 text-sm font-semibold ">
              <BadgePending text="Pendiente" />
            </span>
          )}
        </div>
      ),
    },
    {
      header: " ",
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          {row.original.status !== "played" && (
            <>
              {/* Si no está jugado y no tiene turno, muestra EditMatchDialog */}
              {row.original.shift === null ? (
                <EditMatchDialog
                  match={row.original}
                  onUpdateMatches={onUpdateMatches}
                />
              ) : (
                <>
                  <AddResultMatchDialog
                    match={row.original}
                    onUpdateMatches={onUpdateMatches}
                  />
                  <UpdateShiftDialog
                    match={row.original}
                    onUpdateMatches={onUpdateMatches}
                  />
                  <DeleteShiftDialog
                    idShift={Number(row.original.shift.id)}
                    onUpdateMatches={onUpdateMatches}
                  />
                </>
              )}
              {/* Opcionalmente, si DeleteMatchDialog debe aparecer siempre cuando el partido no está jugado, independientemente del estado del turno */
              /* <DeleteMatchDialog match={row.original} onUpdateMatches={onUpdateMatches} /> */}
            </>
          )}
        </div>
      ),
    },
  ];

  return columns;
};
