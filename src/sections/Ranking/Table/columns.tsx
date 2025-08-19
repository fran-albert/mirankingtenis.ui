"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Ranking } from "@/modules/ranking/domain/Ranking";
import { TournamentRanking } from "@/types/Tournament-Ranking/TournamentRanking";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export const getColumns = (): ColumnDef<TournamentRanking>[] => {
  const columns: ColumnDef<TournamentRanking>[] = [
    {
      accessorKey: "POS",
      enableSorting: false,
      cell: ({ row }) => {
        return <div>{row.original.position}</div>;
      },
    },
    {
      accessorKey: "name",
      enableSorting: false,
      header: "Jugador",
      cell: ({ row }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() =>
            (window.location.href = `/jugadores/${row.original.idPlayer}`)
          }
        >
          <Avatar>
            <AvatarImage
              src={
                row.original.photo
                  ? `https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${row.original.photo}.jpeg`
                  : "https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/mirankingtenis_default.png"
              }
              alt="@avatar"
            />
            <AvatarFallback>
              {row.original.name.charAt(0)}
              {row.original.lastname.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col ml-2">
            <p className="text-sm font-medium">
              {row.original.lastname}, {row.original.name}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "PTS",
      enableSorting: false,
      cell: ({ row }) => <div className="font-bold">{row.original.points}</div>,
    },
    {
      header: "PJ",
      enableSorting: false,
      cell: ({ row }) => <div className="">{row.original.playedMatches}</div>,
    },
    {
      header: "PG",
      enableSorting: false,
      cell: ({ row }) => <div className="">{row.original.wonMatches}</div>,
    },
    {
      header: "PP",
      enableSorting: false,
      cell: ({ row }) => <div className="">{row.original.lostMatches}</div>,
    },
    {
      header: "SG",
      enableSorting: false,
      cell: ({ row }) => <div className="">{row.original.setsWon}</div>,
    },
    {
      header: "SP",
      enableSorting: false,
      cell: ({ row }) => <div className="">{row.original.setsLost}</div>,
    },
    {
      header: "DIF",
      enableSorting: false,
      cell: ({ row }) => <div className="">{row.original.setsDifference}</div>,
    },
  ];

  return columns;
};
