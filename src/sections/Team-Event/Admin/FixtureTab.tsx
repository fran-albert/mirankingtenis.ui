"use client";
import { useState, useEffect } from "react";
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
import { TeamEvent } from "@/types/Team-Event/TeamEvent";
import { TeamEventStatus } from "@/common/enum/team-event.enum";
import { useTeamEventSeries } from "@/hooks/Team-Event/useTeamEventSeries";
import { useTeamEventTeams } from "@/hooks/Team-Event/useTeamEventTeams";
import { useSeriesMutations } from "@/hooks/Team-Event/useTeamEventMutations";
import { FixtureView } from "../FixtureView";
import { Plus, Trash2 } from "lucide-react";

interface FixtureTabProps {
  event: TeamEvent;
  categoryId: number;
  onSeriesClick?: (seriesId: number) => void;
}

export function FixtureTab({ event, categoryId, onSeriesClick }: FixtureTabProps) {
  const { series, isLoading } = useTeamEventSeries(event.id, categoryId);
  const { teams } = useTeamEventTeams(event.id, categoryId);
  const {
    createSeriesMutation,
    deleteSeriesMutation,
    deleteFixtureMutation,
  } = useSeriesMutations(event.id, categoryId);

  const [matchday, setMatchday] = useState("1");
  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");

  useEffect(() => {
    setHomeTeamId("");
    setAwayTeamId("");
  }, [categoryId]);

  const isFinished = event.status === TeamEventStatus.finished;

  const handleCreateSeries = () => {
    const md = parseInt(matchday, 10);
    const home = parseInt(homeTeamId, 10);
    const away = parseInt(awayTeamId, 10);

    if (isNaN(md) || md < 1) {
      toast.error("Jornada inválida");
      return;
    }
    if (isNaN(home) || isNaN(away)) {
      toast.error("Seleccioná ambos equipos");
      return;
    }
    if (home === away) {
      toast.error("Los equipos no pueden ser el mismo");
      return;
    }

    createSeriesMutation.mutate(
      { homeTeamId: home, awayTeamId: away, matchday: md },
      {
        onSuccess: () => {
          toast.success("Enfrentamiento creado");
          setHomeTeamId("");
          setAwayTeamId("");
        },
        onError: () => toast.error("Error al crear el enfrentamiento"),
      }
    );
  };

  const handleDeleteSeries = (seriesId: number) => {
    if (!confirm("¿Eliminar este enfrentamiento?")) return;
    deleteSeriesMutation.mutate(seriesId, {
      onSuccess: () => toast.success("Enfrentamiento eliminado"),
      onError: () =>
        toast.error(
          "No se pudo eliminar. Si tiene resultados cargados, eliminá el resultado primero."
        ),
    });
  };

  const handleDeleteFixture = () => {
    if (
      !confirm(
        "¿Eliminar TODO el fixture? Se borrarán todos los enfrentamientos sin resultado."
      )
    )
      return;
    deleteFixtureMutation.mutate(undefined, {
      onSuccess: () => toast.success("Fixture eliminado"),
      onError: () => toast.error("Error al eliminar el fixture"),
    });
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Cargando fixture...</p>;
  }

  const availableAwayTeams = teams.filter(
    (t) => t.id.toString() !== homeTeamId
  );

  return (
    <div className="space-y-6">
      {!isFinished && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Agregar enfrentamiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4 items-end">
              <div className="space-y-2">
                <Label>Jornada</Label>
                <Input
                  type="number"
                  min={1}
                  value={matchday}
                  onChange={(e) => setMatchday(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Equipo local</Label>
                <Select value={homeTeamId} onValueChange={(v) => {
                  setHomeTeamId(v);
                  if (v === awayTeamId) setAwayTeamId("");
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Equipo visitante</Label>
                <Select value={awayTeamId} onValueChange={setAwayTeamId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAwayTeams.map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleCreateSeries}
                disabled={
                  createSeriesMutation.isPending ||
                  !homeTeamId ||
                  !awayTeamId
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                {createSeriesMutation.isPending ? "Creando..." : "Agregar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <FixtureView
        series={series}
        onSeriesClick={onSeriesClick ? (s) => onSeriesClick(s.id) : undefined}
        onDeleteSeries={!isFinished ? handleDeleteSeries : undefined}
      />

      {series.length > 0 && !isFinished && (
        <div className="pt-4 border-t">
          <Button
            variant="destructive"
            onClick={handleDeleteFixture}
            disabled={deleteFixtureMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteFixtureMutation.isPending
              ? "Eliminando..."
              : "Eliminar todo el fixture"}
          </Button>
        </div>
      )}
    </div>
  );
}
