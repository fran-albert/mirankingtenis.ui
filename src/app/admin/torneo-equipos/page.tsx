"use client";
import { useState } from "react";
import { useTeamEvents } from "@/hooks/Team-Event/useTeamEvents";
import { useEventMutations } from "@/hooks/Team-Event/useTeamEventMutations";
import { TeamEvent, CreateTeamEventRequest } from "@/types/Team-Event/TeamEvent";
import { TeamEventStatus } from "@/common/enum/team-event.enum";
import Loading from "@/components/Loading/loading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { toast } from "sonner";

const statusConfig: Record<
  TeamEventStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  [TeamEventStatus.draft]: { label: "Borrador", variant: "secondary" },
  [TeamEventStatus.registration]: { label: "Inscripción", variant: "outline" },
  [TeamEventStatus.active]: { label: "En curso", variant: "default" },
  [TeamEventStatus.finished]: { label: "Finalizado", variant: "destructive" },
};

export default function TeamEventsListPage() {
  const { events, isLoading } = useTeamEvents();
  const { createEventMutation, deleteEventMutation } = useEventMutations();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateTeamEventRequest>({
    name: "",
    startDate: "",
  });

  const handleCreate = async () => {
    try {
      await createEventMutation.mutateAsync(formData);
      toast.success("Torneo creado exitosamente");
      setOpen(false);
      setFormData({ name: "", startDate: "" });
    } catch {
      toast.error("Error al crear el torneo");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este torneo?")) return;
    try {
      await deleteEventMutation.mutateAsync(id);
      toast.success("Torneo eliminado");
    } catch {
      toast.error("Error al eliminar");
    }
  };

  if (isLoading) return <Loading isLoading={true} />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Torneo por Equipos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Crear Torneo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Torneo por Equipos</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nombre</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Copa 9 Games 2026"
                />
              </div>
              <div>
                <Label>Descripción</Label>
                <Input
                  value={formData.description ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descripción del torneo"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fecha Inicio</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Fecha Fin</Label>
                  <Input
                    type="date"
                    value={formData.endDate ?? ""}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button
                onClick={handleCreate}
                disabled={!formData.name || !formData.startDate}
                className="w-full"
              >
                Crear Torneo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Fecha Inicio</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event: TeamEvent) => {
            const cfg = statusConfig[event.status] ?? {
              label: event.status,
              variant: "secondary" as const,
            };
            return (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell>
                  {new Date(event.startDate).toLocaleDateString("es-AR", {
                    timeZone: "America/Buenos_Aires",
                  })}
                </TableCell>
                <TableCell>
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                </TableCell>
                <TableCell className="space-x-2">
                  <Link href={`/admin/torneo-equipos/${event.id}`}>
                    <Button variant="outline" size="sm">
                      Gestionar
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          {events.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-gray-500 py-8"
              >
                No hay torneos creados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
