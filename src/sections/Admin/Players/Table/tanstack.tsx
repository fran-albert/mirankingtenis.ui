"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MdAdminPanelSettings } from "react-icons/md";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IoMenu } from "react-icons/io5";
import { signOut } from "next-auth/react";
import { User } from "@/modules/users/domain/User";
import { formatDate } from "@/lib/utils";
import { DataTable } from "@/components/Table/dataTable";
import { getColumns } from "./columns";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import { getAllUsers } from "@/modules/users/application/get-all/getAllUsers";
import useRoles from "@/hooks/useRoles";
import { useCustomSession } from "@/context/SessionAuthProviders";
function AdminPlayersTanstackTable({ players }: { players: User[] }) {
  const [isLoading, setIsLoading] = useState(true);

  const { isAdmin } = useRoles();
  const { session } = useCustomSession();
  const canAddUser = !!session && isAdmin;

  const handlePlayerDeleted = (idPlayer: number) => {
    (currentPlayers: User[]) =>
      currentPlayers.filter((player) => player.id !== idPlayer);
  };

  const playersColumns = getColumns({ isAdmin });
  const customFilterFunction = (player: User, query: string) =>
    player.name.toLowerCase().includes(query.toLowerCase()) ||
    player.lastname.toLowerCase().includes(query.toLowerCase());

  return (
    <>
      <DataTable
        columns={playersColumns}
        data={players}
        searchPlaceholder="Buscar jugadores..."
        showSearch={true}
        addLinkPath="jugadores/agregar"
        customFilter={customFilterFunction}
        addLinkText="Agregar Jugador"
        canAddUser={canAddUser}
      />
    </>
  );
}

export default AdminPlayersTanstackTable;
