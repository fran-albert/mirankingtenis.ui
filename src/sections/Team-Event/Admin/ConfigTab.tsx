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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  TeamEvent,
  TeamEventCategory,
  CreateTeamEventRequest,
} from "@/types/Team-Event/TeamEvent";
import { TeamEventStatus } from "@/common/enum/team-event.enum";
import { useEventMutations, useCategoryMutations } from "@/hooks/Team-Event/useTeamEventMutations";
import { useTeamEventCategories } from "@/hooks/Team-Event/useTeamEventCategories";
import { Trash2, Plus } from "lucide-react";

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
  const { categories, isLoading: categoriesLoading } = useTeamEventCategories(event.id);
  const {
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  } = useCategoryMutations(event.id);

  const [form, setForm] = useState<Partial<CreateTeamEventRequest>>({
    name: event.name,
    description: event.description ?? "",
    startDate: event.startDate?.split("T")[0] ?? "",
    endDate: event.endDate?.split("T")[0] ?? "",
    status: event.status,
    rounds: event.rounds,
    singlesPerSeries: event.singlesPerSeries,
    doublesPerSeries: event.doublesPerSeries,
    gamesPerMatch: event.gamesPerMatch,
    noAdvantage: event.noAdvantage,
    maxSinglesPerPlayerRegular: event.maxSinglesPerPlayerRegular,
  });

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryMaxPlayers, setNewCategoryMaxPlayers] = useState("5");

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

  const handleCreateCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    const maxPlayers = parseInt(newCategoryMaxPlayers, 10);
    createCategoryMutation.mutate(
      { name, maxPlayersPerTeam: isNaN(maxPlayers) ? 5 : Math.max(2, maxPlayers) },
      {
        onSuccess: () => {
          setNewCategoryName("");
          setNewCategoryMaxPlayers("5");
          toast.success("Categoría creada");
        },
        onError: () => toast.error("Error al crear la categoría"),
      }
    );
  };

  const handleUpdateCategoryMaxPlayers = (category: TeamEventCategory, raw: string) => {
    const parsed = parseInt(raw, 10);
    if (isNaN(parsed) || parsed < 2) return;
    updateCategoryMutation.mutate(
      { categoryId: category.id, data: { maxPlayersPerTeam: parsed } },
      {
        onSuccess: () => toast.success("Categoría actualizada"),
        onError: () => toast.error("Error al actualizar"),
      }
    );
  };

  const handleDeleteCategory = (category: TeamEventCategory) => {
    if (!confirm(`¿Eliminar la categoría "${category.name}"? Se eliminarán sus equipos y series.`))
      return;
    deleteCategoryMutation.mutate(category.id, {
      onSuccess: () => toast.success("Categoría eliminada"),
      onError: () => toast.error("No se pudo eliminar. Puede tener series con resultados cargados."),
    });
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

      <h3 className="text-lg font-semibold pt-6">Categorías</h3>
      {categoriesLoading ? (
        <p className="text-muted-foreground">Cargando categorías...</p>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <Card key={cat.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{cat.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Label className="text-xs whitespace-nowrap">Máx. jugadores:</Label>
                      <Input
                        type="number"
                        min={2}
                        className="w-16 h-8 text-sm"
                        defaultValue={cat.maxPlayersPerTeam}
                        onBlur={(e) => handleUpdateCategoryMaxPlayers(cat, e.target.value)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteCategory(cat)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  {event.categories?.find((c) => c.id === cat.id)?.teams?.length ?? 0} equipos
                </p>
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-2 items-end pt-2">
            <div className="flex-1 space-y-1">
              <Label className="text-sm">Nueva categoría</Label>
              <Input
                placeholder="Nombre de la categoría"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
              />
            </div>
            <div className="w-20 space-y-1">
              <Label className="text-sm">Jugadores</Label>
              <Input
                type="number"
                min={2}
                value={newCategoryMaxPlayers}
                onChange={(e) => setNewCategoryMaxPlayers(e.target.value)}
              />
            </div>
            <Button
              onClick={handleCreateCategory}
              disabled={createCategoryMutation.isPending || !newCategoryName.trim()}
            >
              <Plus className="h-4 w-4 mr-1" />
              Crear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
