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
import ActionIcon from "@/components/ui/actionIcon";
import { FaTrashAlt } from "react-icons/fa";
import { deleteUser } from "@/api/Users/delete-user";
import { toast } from "sonner";

interface DeletePlayerDialogProps {
  handlePlayerDeleted?: (idlayer: number) => void;
  idPlayer: number;
}

export default function DeletePlayerDialog({
  handlePlayerDeleted,
  idPlayer,
}: DeletePlayerDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleDialog = () => setIsOpen(!isOpen);

  const handleConfirmDelete = async () => {
    try {
      const playerDeletionPromise = deleteUser(idPlayer);
      toast.promise(playerDeletionPromise, {
        loading: "Eliminando jugador...",
        success: "Jugador eliminado con éxito!",
        error: "Error al eliminar el Jugador",
        duration: 3000,
      });
      if (handlePlayerDeleted) {
        handlePlayerDeleted(idPlayer); // Pasar idPlayer aquí
      }
    } catch (error) {
      console.error("Error al eliminar el Jugador", error);
      toast.error("Error al eliminar el Jugador");
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button onClick={toggleDialog} className="m-2">
          <ActionIcon
            icon={
              <FaTrashAlt
                size={18}
                className="text-red-500 hover:text-red-700"
              />
            }
            tooltip="Eliminar"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar Jugador</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          ¿Estás seguro de que quieres eliminar este jugador?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={toggleDialog}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirmDelete}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
