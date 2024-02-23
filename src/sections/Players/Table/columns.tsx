"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditButton } from "@/components/Button/Edit/button";
import DeletePlayerDialog from "@/components/Button/Delete/button";
// import AddLabDialog from "@/components/Button/Add/Lab/button";
// import { formatDni } from "@/common/helpers/helpers";
// import { User } from "@/modules/users/domain/User";
// import { FaRegEye } from "react-icons/fa";
// import DeletePatientDialog from "../delete/DeletePatientDialog";
// import { Button } from "@/components/ui/button";
// import { ViewButton } from "@/components/Button/View/button";

interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
}

export const getColumns = (
  fetchUsers: () => void
): //
//   roles: { isSecretary: boolean; isDoctor: boolean }
ColumnDef<User>[] => {
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
      accessorKey: "firstName",
      header: "Jugador",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Avatar>
            <AvatarImage
              // src={
              //   row.original.photo
              //     ? `https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/${row.original.photo}`
              //     : "https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/default.png"
              // }
              src={
                "https://www.atptour.com/-/media/tennis/players/head-shot/2020/02/26/11/55/federer_head_ao20.png?sc=0&hash=7A17A4E9C10DF90A2C987081C7EEE1E8"
              }
              alt="@avatar"
            />
            <AvatarFallback>
              {`${row.original.name}${row.original.lastname}`}
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
          {/* {roles.isSecretary && ( */}
          <>
            {/* <AddLabDialog idPatient={row.original.id} /> */}
            <EditButton id={row.original.id} path="usuarios/pacientes" />
            {/* <ViewButton id={row.original.id} text="Ver Paciente" /> */}
            <DeletePlayerDialog
              idCategory={row.original.id}
              // idPatient={row.original.id}
              // onPatientDeleted={fetchPatients}
            />
          </>
          {/* )} */}
        </div>
      ),
    },
  ];

  return columns;
};
