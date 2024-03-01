"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditButton } from "@/components/Button/Edit/button";
import DeletePlayerDialog from "@/components/Button/Delete/button";
import { User } from "@/modules/users/domain/User";
import { Ranking } from "@/modules/ranking/domain/Ranking";
// import { formatDni } from "@/common/helpers/helpers";
// import { FaRegEye } from "react-icons/fa";
// import { Button } from "@/components/ui/button";
// import { ViewButton } from "@/components/Button/View/button";

export const getColumns = (): //
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
              src={`https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${row.original.user.photo}`}
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
