import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DialogDemoProps {
  selectedSlot: any;
  onClose: () => void;
}

export function DialogDemo({ selectedSlot, onClose }: DialogDemoProps) {
  const start = selectedSlot?.start ? new Date(selectedSlot.start).toLocaleString() : '';
  const end = selectedSlot?.end ? new Date(selectedSlot.end).toLocaleString() : '';

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Evento</DialogTitle>
          <DialogDescription>
            Ingresa los detalles del nuevo evento y haz clic en guardar cuando hayas terminado.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre del Evento
            </Label>
            <Input id="name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start" className="text-right">
              Inicio
            </Label>
            <Input id="start" value={start} readOnly className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end" className="text-right">
              Fin
            </Label>
            <Input id="end" value={end} readOnly className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onClose}>
            Guardar Evento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
