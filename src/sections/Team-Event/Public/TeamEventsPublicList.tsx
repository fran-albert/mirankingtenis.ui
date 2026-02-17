"use client";
import { useTeamEvents } from "@/hooks/Team-Event/useTeamEvents";
import { TeamEvent } from "@/types/Team-Event/TeamEvent";
import { TeamEventStatus } from "@/common/enum/team-event.enum";
import Loading from "@/components/Loading/loading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const statusConfig: Record<
  TeamEventStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  [TeamEventStatus.draft]: { label: "Borrador", variant: "secondary" },
  [TeamEventStatus.registration]: { label: "Inscripción", variant: "outline" },
  [TeamEventStatus.active]: { label: "En curso", variant: "default" },
  [TeamEventStatus.finished]: { label: "Finalizado", variant: "destructive" },
};

export function TeamEventsPublicList() {
  const { events, isLoading } = useTeamEvents();

  if (isLoading) return <Loading isLoading={true} />;

  const visibleEvents = events.filter(
    (e: TeamEvent) => e.status !== TeamEventStatus.draft
  );

  if (visibleEvents.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Torneo por Equipos</h1>
        <p className="text-gray-500">No hay torneos disponibles</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Torneos por Equipos
      </h1>
      <div className="grid gap-4 md:grid-cols-2">
        {visibleEvents.map((event: TeamEvent) => {
          const cfg = statusConfig[event.status] ?? {
            label: event.status,
            variant: "secondary" as const,
          };
          return (
            <Link key={event.id} href={`/torneo-equipos/${event.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-semibold text-lg">{event.name}</h2>
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                  </div>
                  {event.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {event.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.startDate).toLocaleDateString("es-AR", {
                      timeZone: "America/Buenos_Aires",
                    })}
                    {event.endDate &&
                      ` - ${new Date(event.endDate).toLocaleDateString("es-AR", {
                        timeZone: "America/Buenos_Aires",
                      })}`}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
