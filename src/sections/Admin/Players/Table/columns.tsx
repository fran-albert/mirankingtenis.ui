"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditButton } from "@/components/Button/Edit/button";
import { User } from "@/types/User/User";
import { Button } from "@/components/ui/button";
import DeletePlayerDialog from "@/sections/Players/Delete/button";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export const getColumns = (
  roles: {
    isAdmin: boolean | undefined;
  },
  router: ReturnType<typeof useRouter>
): ColumnDef<User>[] => {
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
        <div
          className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
          onClick={() => router.push(`/admin/jugadores/${row.original.id}`)}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={row.original.photo}
              alt={`${row.original.name} ${row.original.lastname}`}
            />
            <AvatarFallback>
              {row.original.name?.charAt(0)}
              {row.original.lastname?.charAt(0)}
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
      accessorKey: "email",
      header: "Correo Electronico",
      enableSorting: false,
      meta: { hideOnMobile: true },
      cell: ({ row }) => <div>{row.original.email}</div>,
    },
    {
      accessorKey: "registerDate",
      header: "Registro",
      enableSorting: true,
      meta: { hideOnMobile: true },
      cell: ({ row }) => <div>{formatDate(row.original.registerDate)}</div>,
    },
    {
      accessorKey: "lastLoginDate",
      header: "Ultimo Login",
      enableSorting: true,
      meta: { hideOnMobile: true },
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
