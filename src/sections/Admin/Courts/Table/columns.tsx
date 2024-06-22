"use client";

import { ColumnDef } from "@tanstack/react-table";
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
