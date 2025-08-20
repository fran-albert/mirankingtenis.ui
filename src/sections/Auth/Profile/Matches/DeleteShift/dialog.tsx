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
import { toast } from "sonner";
import { useShiftMutation } from "@/hooks/Shift/useShiftMutation";

interface DeleteShiftDialogProps {
  idShift: number;
  onUpdateMatches?: () => void;
}

export default function DeleteShiftDialog({
  idShift,
  onUpdateMatches,
}: DeleteShiftDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { deleteShiftMutation } = useShiftMutation();
  
  const handleDeleteShift = () => {
    deleteShiftMutation.mutate(idShift, {
      onSuccess: () => {
        toast.success("Turno eliminado con éxito");
        if (onUpdateMatches) {
          onUpdateMatches();
        }
        toggleDialog();
      },
      onError: (error: any) => {
        toast.error("Ocurrió un error al eliminar el turno");
        console.error("Error al eliminar turno:", error);
      }
    });
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
