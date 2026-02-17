"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { TeamEvent, CreateTeamEventRequest } from "@/types/Team-Event/TeamEvent";
import { TeamEventStatus } from "@/common/enum/team-event.enum";
import { useEventMutations } from "@/hooks/Team-Event/useTeamEventMutations";

interface ConfigTabProps {
  event: TeamEvent;
}

const statusLabels: Record<TeamEventStatus, string> = {
  [TeamEventStatus.draft]: "Borrador",
  [TeamEventStatus.registration]: "Inscripción",
  [TeamEventStatus.active]: "En curso",
  [TeamEventStatus.finished]: "Finalizado",
};

export function ConfigTab({ event }: ConfigTabProps) {
  const { updateEventMutation } = useEventMutations();
  const [form, setForm] = useState<Partial<CreateTeamEventRequest>>({
    name: event.name,
    description: event.description ?? "",
    startDate: event.startDate?.split("T")[0] ?? "",
    endDate: event.endDate?.split("T")[0] ?? "",
    status: event.status,
    rounds: event.rounds,
    maxPlayersPerTeam: event.maxPlayersPerTeam,
    singlesPerSeries: event.singlesPerSeries,
    doublesPerSeries: event.doublesPerSeries,
    gamesPerMatch: event.gamesPerMatch,
    noAdvantage: event.noAdvantage,
    maxSinglesPerPlayerRegular: event.maxSinglesPerPlayerRegular,
  });

  const handleChange = (key: keyof CreateTeamEventRequest, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNumberChange = (key: keyof CreateTeamEventRequest, raw: string, min: number) => {
    const parsed = parseInt(raw, 10);
    if (raw === "" || isNaN(parsed)) return;
    handleChange(key, Math.max(min, parsed));
  };

  const isConfigValid = (): boolean => {
    if (!form.name?.trim()) return false;
    if (!form.startDate) return false;
    const singles = form.singlesPerSeries ?? 0;
    const doubles = form.doublesPerSeries ?? 0;
    if (singles + doubles < 1) return false;
    return true;
  };

  const handleSave = () => {
    if (!isConfigValid()) {
      toast.error("Revisá los campos obligatorios");
      return;
    }
    updateEventMutation.mutate(
      { id: event.id, data: form },
      {
        onSuccess: () => toast.success("Configuración guardada"),
        onError: () => toast.error("Error al guardar la configuración"),
      }
    );
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del torneo</Label>
          <Input
            id="name"
            value={form.name ?? ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select
            value={form.status}
            onValueChange={(v) => handleChange("status", v as TeamEventStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Input
          id="description"
          value={form.description ?? ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Fecha de inicio</Label>
          <Input
            id="startDate"
            type="date"
            value={form.startDate ?? ""}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">Fecha de fin</Label>
          <Input
            id="endDate"
            type="date"
            value={form.endDate ?? ""}
            onChange={(e) => handleChange("endDate", e.target.value)}
          />
        </div>
      </div>

      <h3 className="text-lg font-semibold pt-4">Formato de juego</h3>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="rounds">Rondas (vueltas)</Label>
          <Input
            id="rounds"
            type="number"
            min={1}
            value={form.rounds ?? 1}
            onChange={(e) => handleNumberChange("rounds", e.target.value, 1)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxPlayersPerTeam">Jugadores por equipo</Label>
          <Input
            id="maxPlayersPerTeam"
            type="number"
            min={2}
            value={form.maxPlayersPerTeam ?? 5}
            onChange={(e) => handleNumberChange("maxPlayersPerTeam", e.target.value, 2)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gamesPerMatch">Games por partido</Label>
          <Input
            id="gamesPerMatch"
            type="number"
            min={1}
            value={form.gamesPerMatch ?? 9}
            onChange={(e) => handleNumberChange("gamesPerMatch", e.target.value, 1)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="singlesPerSeries">Singles por serie</Label>
          <Input
            id="singlesPerSeries"
            type="number"
            min={0}
            value={form.singlesPerSeries ?? 2}
            onChange={(e) => handleNumberChange("singlesPerSeries", e.target.value, 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="doublesPerSeries">Dobles por serie</Label>
          <Input
            id="doublesPerSeries"
            type="number"
            min={0}
            value={form.doublesPerSeries ?? 1}
            onChange={(e) => handleNumberChange("doublesPerSeries", e.target.value, 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxSinglesPerPlayerRegular">
            Máx. singles por jugador (regular)
          </Label>
          <Input
            id="maxSinglesPerPlayerRegular"
            type="number"
            min={1}
            value={form.maxSinglesPerPlayerRegular ?? 2}
            onChange={(e) =>
              handleNumberChange("maxSinglesPerPlayerRegular", e.target.value, 1)
            }
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          id="noAdvantage"
          type="checkbox"
          checked={form.noAdvantage ?? true}
          onChange={(e) => handleChange("noAdvantage", e.target.checked)}
          className="h-4 w-4"
        />
        <Label htmlFor="noAdvantage">Sin ventaja (golden point)</Label>
      </div>

      <Button
        onClick={handleSave}
        disabled={updateEventMutation.isPending || !isConfigValid()}
      >
        {updateEventMutation.isPending ? "Guardando..." : "Guardar cambios"}
      </Button>
    </div>
  );
}
