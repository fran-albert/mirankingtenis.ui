"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditButton } from "@/components/Button/Edit/button";
import { User } from "@/types/User/User";
import { Button } from "@/components/ui/button";
import DeletePlayerDialog from "@/sections/Players/Delete/button";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const getColumns = (roles: {
  isAdmin: boolean | undefined;
}): ColumnDef<User>[] => {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "#",
      header: "#",
      enableSorting: false,
      cell: ({ row }) => {
        const index = row.index;
        return <div>{index + 1}</div>;
      },
    },
    {
      accessorKey: "name",
      header: "Jugador",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center cursor-pointer">
          <div className="flex flex-col ml-2">
            <p className="text-sm font-medium">
              {row.original.lastname}, {row.original.name}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Correo Electronico",
      enableSorting: false,
      cell: ({ row }) => <div>{row.original.email}</div>,
    },
    {
      accessorKey: "registerDate",
      header: "Registro",
      enableSorting: true,
      cell: ({ row }) => <div>{formatDate(row.original.registerDate)}</div>,
    },
    {
      accessorKey: "lastLoginDate", 
      header: "Último Login",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="font-bold">
          {row.original.lastLoginDate
            ? formatDate(row.original.lastLoginDate)
            : "Nunca"}
        </div>
      ),
    },
  ];

  return columns;
};

