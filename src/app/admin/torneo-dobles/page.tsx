"use client";
import React, { useState } from "react";
import { useDoublesEvents } from "@/hooks/Doubles-Event/useDoublesEvents";
import { useDoublesEventMutations } from "@/hooks/Doubles-Event/useDoublesEventMutations";
import { DoublesEvent, CreateDoublesEventRequest } from "@/types/Doubles-Event/DoublesEvent";
import { DoublesEventStatus } from "@/common/enum/doubles-event.enum";
import Loading from "@/components/Loading/loading";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";

function DoublesEventListPage() {
  const { events, isLoading } = useDoublesEvents();
  const { createEventMutation, deleteEventMutation } =
    useDoublesEventMutations();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateDoublesEventRequest>({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleCreate = async () => {
    try {
      await createEventMutation.mutateAsync(formData);
      toast.success("Evento creado exitosamente");
      setOpen(false);
      setFormData({ name: "", startDate: "", endDate: "", description: "" });
    } catch {
      toast.error("Error al crear el evento");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este evento?")) return;
    try {
      await deleteEventMutation.mutateAsync(id);
      toast.success("Evento eliminado");
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const statusLabel = (status: DoublesEventStatus) => {
    const map: Record<DoublesEventStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      [DoublesEventStatus.draft]: { label: "Borrador", variant: "secondary" },
      [DoublesEventStatus.active]: { label: "Activo", variant: "default" },
      [DoublesEventStatus.finished]: { label: "Finalizado", variant: "outline" },
    };
    const s = map[status] || { label: status, variant: "secondary" as const };
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  if (isLoading) return <Loading isLoading={true} />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Torneo Dobles</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Crear Evento</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Evento de Dobles</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nombre</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Torneo Dobles La Villa 2026"
                />
              </div>
              <div>
                <Label>Descripción</Label>
                <Input
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descripción del evento"
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
                    value={formData.endDate || ""}
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
                Crear Evento
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
          {events.map((event: DoublesEvent) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.name}</TableCell>
              <TableCell>
                {new Date(event.startDate).toLocaleDateString("es-AR")}
              </TableCell>
              <TableCell>{statusLabel(event.status)}</TableCell>
              <TableCell className="space-x-2">
                <Link href={`/admin/torneo-dobles/${event.id}`}>
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
          ))}
          {events.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                No hay eventos creados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DoublesEventListPage;
