"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { TeamEventTeam, TeamEventPlayer } from "@/types/Team-Event/TeamEvent";
import { User } from "@/types/User/User";
import { useTeamEventTeams } from "@/hooks/Team-Event/useTeamEventTeams";
import { useTeamMutations } from "@/hooks/Team-Event/useTeamEventMutations";
import { Trash2, UserPlus, UserMinus, RefreshCw, Plus } from "lucide-react";

interface TeamsTabProps {
  eventId: number;
  categoryId: number;
  maxPlayersPerTeam: number;
  allUsers: User[];
}

export function TeamsTab({ eventId, categoryId, maxPlayersPerTeam, allUsers }: TeamsTabProps) {
  const { teams, isLoading } = useTeamEventTeams(eventId, categoryId);
  const {
    createTeamMutation,
    deleteTeamMutation,
    addPlayerMutation,
    removePlayerMutation,
    replacePlayerMutation,
  } = useTeamMutations(eventId, categoryId);

  const [newTeamName, setNewTeamName] = useState("");
  const [addPlayerDialog, setAddPlayerDialog] = useState<{
    open: boolean;
    teamId: number;
  }>({ open: false, teamId: 0 });
  const [replacePlayerDialog, setReplacePlayerDialog] = useState<{
    open: boolean;
    teamId: number;
    playerId: number;
    playerName: string;
  }>({ open: false, teamId: 0, playerId: 0, playerName: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const allRosteredPlayerIds = new Set(
    teams.flatMap((t: TeamEventTeam) =>
      t.players
        .filter((p: TeamEventPlayer) => !p.leftAt)
        .map((p: TeamEventPlayer) => p.playerId)
    )
  );

  const availableUsers = allUsers.filter(
    (u) =>
      !allRosteredPlayerIds.has(u.id) &&
      `${u.name} ${u.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return;
    createTeamMutation.mutate(
      { name: newTeamName.trim() },
      {
        onSuccess: () => {
          setNewTeamName("");
          toast.success("Equipo creado");
        },
        onError: () => toast.error("Error al crear equipo"),
      }
    );
  };

  const handleDeleteTeam = (teamId: number, teamName: string) => {
    if (!confirm(`¿Eliminar el equipo "${teamName}"?`)) return;
    deleteTeamMutation.mutate(teamId, {
      onSuccess: () => toast.success("Equipo eliminado"),
      onError: () => toast.error("Error al eliminar equipo"),
    });
  };

  const handleAddPlayer = (teamId: number, playerId: number) => {
    addPlayerMutation.mutate(
      { teamId, data: { playerId } },
      {
        onSuccess: () => {
          toast.success("Jugador agregado");
          setAddPlayerDialog({ open: false, teamId: 0 });
          setSearchTerm("");
        },
        onError: () => toast.error("Error al agregar jugador"),
      }
    );
  };

  const handleRemovePlayer = (teamId: number, playerId: number) => {
    if (!confirm("¿Dar de baja a este jugador?")) return;
    removePlayerMutation.mutate(
      { teamId, playerId },
      {
        onSuccess: () => toast.success("Jugador dado de baja"),
        onError: () => toast.error("Error al dar de baja"),
      }
    );
  };

  const handleReplacePlayer = (
    teamId: number,
    playerId: number,
    newPlayerId: number
  ) => {
    replacePlayerMutation.mutate(
      { teamId, playerId, data: { newPlayerId } },
      {
        onSuccess: () => {
          toast.success("Jugador reemplazado");
          setReplacePlayerDialog({ open: false, teamId: 0, playerId: 0, playerName: "" });
          setSearchTerm("");
        },
        onError: () => toast.error("Error al reemplazar jugador"),
      }
    );
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Cargando equipos...</p>;
  }

  const activePlayers = (team: TeamEventTeam) =>
    team.players.filter((p: TeamEventPlayer) => !p.leftAt);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 items-end">
        <div className="flex-1 space-y-2">
          <Label>Nuevo equipo</Label>
          <Input
            placeholder="Nombre del equipo"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateTeam()}
          />
        </div>
        <Button onClick={handleCreateTeam} disabled={createTeamMutation.isPending}>
          <Plus className="h-4 w-4 mr-1" />
          Crear
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {teams.map((team: TeamEventTeam) => (
          <Card key={team.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{team.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {activePlayers(team).length}/{maxPlayersPerTeam}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTeam(team.id, team.name)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              {team.captain && (
                <p className="text-xs text-muted-foreground">
                  Capitán: {team.captain.name} {team.captain.lastname}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              {activePlayers(team).map((p: TeamEventPlayer) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between text-sm py-1 border-b last:border-0"
                >
                  <span>
                    {p.player.name} {p.player.lastname}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      title="Reemplazar"
                      onClick={() =>
                        setReplacePlayerDialog({
                          open: true,
                          teamId: team.id,
                          playerId: p.playerId,
                          playerName: `${p.player.name} ${p.player.lastname}`,
                        })
                      }
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      title="Dar de baja"
                      onClick={() => handleRemovePlayer(team.id, p.playerId)}
                    >
                      <UserMinus className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              {activePlayers(team).length < maxPlayersPerTeam && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() =>
                    setAddPlayerDialog({ open: true, teamId: team.id })
                  }
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Agregar jugador
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={addPlayerDialog.open}
        onOpenChange={(open) => {
          setAddPlayerDialog({ open, teamId: addPlayerDialog.teamId });
          if (!open) setSearchTerm("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar jugador</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="max-h-64 overflow-y-auto space-y-1">
            {availableUsers.slice(0, 20).map((u) => (
              <button
                key={u.id}
                className="w-full text-left px-3 py-2 rounded hover:bg-accent text-sm"
                onClick={() => handleAddPlayer(addPlayerDialog.teamId, u.id)}
              >
                {u.name} {u.lastname}
              </button>
            ))}
            {availableUsers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No se encontraron jugadores disponibles
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={replacePlayerDialog.open}
        onOpenChange={(open) => {
          setReplacePlayerDialog((prev) => ({ ...prev, open }));
          if (!open) setSearchTerm("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reemplazar a {replacePlayerDialog.playerName}
            </DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Buscar reemplazante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="max-h-64 overflow-y-auto space-y-1">
            {availableUsers.slice(0, 20).map((u) => (
              <button
                key={u.id}
                className="w-full text-left px-3 py-2 rounded hover:bg-accent text-sm"
                onClick={() =>
                  handleReplacePlayer(
                    replacePlayerDialog.teamId,
                    replacePlayerDialog.playerId,
                    u.id
                  )
                }
              >
                {u.name} {u.lastname}
              </button>
            ))}
            {availableUsers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No se encontraron jugadores disponibles
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
