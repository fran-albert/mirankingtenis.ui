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
import { createApiTournamentRepository } from "@/modules/tournament/infra/ApiTournamentRepository";
import { getPlayersByTournament } from "@/modules/tournament-participant/application/get-players-by-tournament/getPlayersByTournament";
import { createApiTournamentParticipantRepository } from "@/modules/tournament-participant/infra/ApiTournamentRepository";
import { TournamentParticipant } from "@/modules/tournament-participant/domain/TournamentParticipant";
function PlayersTournamentTable(idTournament: { idTournament: number }) {
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useRoles();
  const { session } = useCustomSession();
  const canAddUser = !!session && isAdmin;
  const [players, setPlayers] = useState<TournamentParticipant[]>([]);

  const tournamentRepository = useMemo(
    () => createApiTournamentParticipantRepository(),
    []
  );
  const loadAllPlayers = useCallback(async () => {
    const users = await getPlayersByTournament(tournamentRepository)(
      Number(idTournament.idTournament)
    );
    return users;
  }, [tournamentRepository]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const userData = await loadAllPlayers();
        setPlayers(userData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [loadAllPlayers]);

  const handlePlayerDesactivated = (idPlayer: number) => {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) =>
        player.idPlayer === idPlayer ? { ...player, isActive: false } : player
      )
    );
  };
  const playersColumns = getColumns(handlePlayerDesactivated, { isAdmin });
  const customFilterFunction = (player: TournamentParticipant, query: string) =>
    player.name.toLowerCase().includes(query.toLowerCase()) ||
    player.lastname.toLowerCase().includes(query.toLowerCase());

  return (
    <div className="">
      <DataTable
        columns={playersColumns}
        data={players}
        searchPlaceholder="Buscar jugadores..."
        pageSizes={8}
        showSearch={true}
        addLinkPath=""
        customFilter={customFilterFunction}
        addLinkText="Inscribir Jugador"
        canAddUser={canAddUser}
      />
    </div>
  );
}

export default PlayersTournamentTable;
