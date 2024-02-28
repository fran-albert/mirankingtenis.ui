"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditButton } from "@/components/Button/Edit/button";
import DeletePlayerDialog from "@/components/Button/Delete/button";
import { User } from "@/modules/users/domain/User";
import { Button } from "@/components/ui/button";

export const getColumns = (
  fetchUsers: () => void,
  roles: { isAdmin: boolean | undefined }
): ColumnDef<User>[] => {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "#",
      header: "#",
      cell: ({ row }) => {
        const index = row.index;
        return <div>{index + 1}</div>;
      },
    },
    {
      accessorKey: "name",
      header: "Jugador",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Avatar>
            <AvatarImage
              src={
                row.original.photo
                  ? `https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/${row.original.photo}`
                  : "https://www.atptour.com/-/media/tennis/players/head-shot/2020/02/26/11/55/federer_head_ao20.png?sc=0&hash=7A17A4E9C10DF90A2C987081C7EEE1E8"
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
      header: "Correo Electronico",
      cell: ({ row }) => <div>{row.original.email}</div>,
    },
    {
      accessorKey: "phone",
      header: "Télefono",
    },
    {
      header: " ",
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          {roles.isAdmin && (
            <>
              <EditButton id={row.original.id} path="jugadores" />
              <DeletePlayerDialog
                idPlayer={row.original.id}
                // onPatientDeleted={fetchPatients}
              />
            </>
          )}
        </div>
      ),
    },
  ];

  return columns;
};
