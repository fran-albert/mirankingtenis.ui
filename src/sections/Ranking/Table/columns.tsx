"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditButton } from "@/components/Button/Edit/button";
import DeletePlayerDialog from "@/components/Button/Delete/button";
import { User } from "@/modules/users/domain/User";
import { Ranking } from "@/modules/ranking/domain/Ranking";
// import AddLabDialog from "@/components/Button/Add/Lab/button";
// import { formatDni } from "@/common/helpers/helpers";
// import { User } from "@/modules/users/domain/User";
// import { FaRegEye } from "react-icons/fa";
// import DeletePatientDialog from "../delete/DeletePatientDialog";
// import { Button } from "@/components/ui/button";
// import { ViewButton } from "@/components/Button/View/button";

export const getColumns = (
  fetchRanking: () => void
): //
//   roles: { isSecretary: boolean; isDoctor: boolean }
ColumnDef<Ranking>[] => {
  const columns: ColumnDef<Ranking>[] = [
    {
      accessorKey: "#",
      header: "#",
      cell: ({ row }) => {
        const index = row.index;
        return <div>{index + 1}</div>;
      },
    },
    {
      accessorKey: "firstName",
      header: "Jugador",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Avatar>
            <AvatarImage
              src={
                row.original.user.photo
                  ? `https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/${row.original.user.photo}`
                  : "https://www.atptour.com/-/media/tennis/players/head-shot/2020/02/26/11/55/federer_head_ao20.png?sc=0&hash=7A17A4E9C10DF90A2C987081C7EEE1E8"
              }
              alt="@avatar"
            />
            <AvatarFallback>
              {row.original.user.name.charAt(0)}
              {row.original.user.lastname.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col ml-2">
            <p className="text-sm font-medium">
              {row.original.user.lastname}, {row.original.user.name}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "PG",
      cell: ({ row }) => <div>{row.original.wonMatches}</div>,
    },
    {
      header: "PP",
      cell: ({ row }) => <div>{row.original.lostMatches}</div>,
    },
    {
      header: "PJ",
      cell: ({ row }) => <div>{row.original.playedMatches}</div>,
    },
    {
      header: "PTS",
      cell: ({ row }) => <div className="font-bold">{row.original.points}</div>,
    },
  ];

  return columns;
};
