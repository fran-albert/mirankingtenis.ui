"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditButton } from "@/components/Button/Edit/button";
import { User } from "@/modules/users/domain/User";
import { Button } from "@/components/ui/button";
import DesactivatePlayerDialog from "@/sections/Players/Desactivate/button";
import DeletePlayerDialog from "@/sections/Players/Delete/button";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/modules/category/domain/Category";
import { Court } from "@/modules/court/domain/Court";
import DeleteCourtDialog from "../Delete/dialog";

export const getColumns = (
  removeCourtFromList: (idCourt: number) => void,
  roles: { isAdmin: boolean | undefined }
): ColumnDef<Court>[] => {
  const columns: ColumnDef<Court>[] = [
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
      header: "Cancha",
      cell: ({ row }) => (
        <div className="flex items-center cursor-pointer">
          <div className="flex flex-col ml-2">
            <p className="text-sm font-medium">{row.original.name}</p>
          </div>
        </div>
      ),
    },
    {
      header: " ",
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          {roles.isAdmin && (
            <div className="flex items-center gap-2">
              <DeleteCourtDialog
                court={row.original}
                removeCourtFromList={removeCourtFromList}
              />
            </div>
          )}
        </div>
      ),
    },
  ];

  return columns;
};
