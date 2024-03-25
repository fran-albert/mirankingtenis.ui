"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createApiShiftRepository } from "@/modules/shift/infra/ApiShiftRepository";
import { toast } from "sonner";

interface DeleteShiftDialogProps {
  idShift: number;
  onUpdateMatches?: () => void;
}

export default function DeleteShiftDialog({
  idShift,
  onUpdateMatches,
}: DeleteShiftDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const shiftRepository = createApiShiftRepository();
  const handleDeleteShift = async () => {
    try {
      await shiftRepository.deleteShift(idShift);
      toast.success("Turno eliminado con éxito");
      if (onUpdateMatches) {
        onUpdateMatches();
      }
      toggleDialog();
    } catch (error) {
      toast.error("Ocurrió un error al eliminar el turno");
    }
  };

  const toggleDialog = () => setIsOpen(!isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="red" className="text-xs">
          Eliminar Turno
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar Turno</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          ¿Estás seguro de que quieres eliminar este turno?
        </DialogDescription>
        <DialogFooter className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <Button
            type="button"
            variant="outline"
            className="w-full md:w-auto"
            onClick={toggleDialog}
          >
            Cancelar
          </Button>
          <Button
            className="bg-slate-700"
            variant="default"
            onClick={handleDeleteShift}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
