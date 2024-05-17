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
import DeleteCategoryDialog from "../Delete/dialog";

export const getColumns = (
  removeCategoryFromList: (idCategory: number) => void,
  roles: { isAdmin: boolean | undefined }
): ColumnDef<Category>[] => {
  const columns: ColumnDef<Category>[] = [
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
      header: "Categoría",
      cell: ({ row }) => (
        <div className="flex items-center cursor-pointer">
          <div className="flex flex-col ml-2">
            <p className="text-sm font-medium">{row.original.name}</p>
          </div>
        </div>
      ),
    },
    // {
    //   header: "Correo Electronico",
    //   cell: ({ row }) => <div>{row.original.email}</div>,
    // },
    // {
    //   header: "Registro",
    //   cell: ({ row }) => <div>{formatDate(row.original.registerDate)}</div>,
    // },
    // {
    //   header: "Último Login",
    //   cell: ({ row }) => (
    //     <div>
    //       {" "}
    //       {row.original.lastLogin
    //         ? formatDate(row.original.lastLogin)
    //         : "Nunca"}
    //     </div>
    //   ),
    // },
    // {
    //   header: "Estado",
    //   cell: ({ row }) => (
    //     <div>
    //       {
    //         <Badge
    //           variant={row.original.isActive ? "success" : "danger"}
    //           className="text-black"
    //         >
    //           {row.original.isActive ? "Activo" : "Inactivo"}
    //         </Badge>
    //       }
    //     </div>
    //   ),
    // },
    {
      header: " ",
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          {roles.isAdmin && (
            <div className="flex items-center gap-2">
              <DeleteCategoryDialog
                category={row.original}
                removeCategoryFromList={removeCategoryFromList}
              />
            </div>
          )}
        </div>
      ),
    },
  ];

  return columns;
};
