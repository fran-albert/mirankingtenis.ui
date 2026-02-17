"use client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TeamEvent } from "@/types/Team-Event/TeamEvent";
import { TeamEventStatus } from "@/common/enum/team-event.enum";
import { useTeamEventSeries } from "@/hooks/Team-Event/useTeamEventSeries";
import { useSeriesMutations } from "@/hooks/Team-Event/useTeamEventMutations";
import { FixtureView } from "../FixtureView";
import { CalendarPlus } from "lucide-react";

interface FixtureTabProps {
  event: TeamEvent;
  categoryId: number;
  onSeriesClick?: (seriesId: number) => void;
}

export function FixtureTab({ event, categoryId, onSeriesClick }: FixtureTabProps) {
  const { series, isLoading } = useTeamEventSeries(event.id, categoryId);
  const { generateFixtureMutation } = useSeriesMutations(event.id, categoryId);

  const canGenerate =
    event.status !== TeamEventStatus.finished && series.length === 0;

  const handleGenerate = () => {
    if (!confirm("¿Generar el fixture? Esta acción creará todas las jornadas."))
      return;
    generateFixtureMutation.mutate(undefined, {
      onSuccess: () => toast.success("Fixture generado correctamente"),
      onError: () => toast.error("Error al generar el fixture"),
    });
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Cargando fixture...</p>;
  }

  return (
    <div className="space-y-4">
      {canGenerate && (
        <Button
          onClick={handleGenerate}
          disabled={generateFixtureMutation.isPending}
        >
          <CalendarPlus className="h-4 w-4 mr-2" />
          {generateFixtureMutation.isPending
            ? "Generando..."
            : "Generar fixture"}
        </Button>
      )}
      <FixtureView
        series={series}
        onSeriesClick={onSeriesClick ? (s) => onSeriesClick(s.id) : undefined}
      />
    </div>
  );
}
