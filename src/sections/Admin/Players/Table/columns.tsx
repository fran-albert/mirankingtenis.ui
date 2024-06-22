"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditButton } from "@/components/Button/Edit/button";
import { User } from "@/modules/users/domain/User";
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
      cell: ({ row }) => {
        const index = row.index;
        return <div>{index + 1}</div>;
      },
    },
    {
      accessorKey: "name",
      header: "Jugador",
      cell: ({ row }) => (
        <div
          className="flex items-center cursor-pointer"
          // onClick={() =>
          //   (window.location.href = `/admin/jugadores/${row.original.id}`)
          // }
        >
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
      header: "Registro",
      cell: ({ row }) => <div>{formatDate(row.original.registerDate)}</div>,
    },
    {
      header: "Último Login",
      cell: ({ row }) => (
        <div className="font-bold">
          {" "}
          {row.original.lastLoginDate
            ? formatDate(row.original.lastLoginDate)
            : "Nunca"}
        </div>
      ),
    },
    // {
    //   header: " ",
    //   cell: ({ row }) => (
    //     <div className="flex items-center justify-end">
    //       {roles.isAdmin && (
    //         <div className="flex items-center gap-2">
    //           <Button size="sm" variant="outline">
    //             Ver
    //           </Button>
    //           <Button color="danger" size="sm" variant="outline">
    //             Desactivar
    //           </Button>
    //         </div>
    //       )}
    //     </div>
    //   ),
    // },
  ];

  return columns;
};
