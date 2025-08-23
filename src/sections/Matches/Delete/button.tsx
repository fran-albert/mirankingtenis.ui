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
import { useDeleteMatch } from "@/hooks/Matches/useMatches";
import { toast } from "sonner";

interface DeleteMatchDialogProps {
  matchId: number;
  onDeleteMatch?: () => void;
}

export default function DeleteMatchDialog({
  matchId,
  onDeleteMatch,
}: DeleteMatchDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const deleteMatchMutation = useDeleteMatch();

  const toggleDialog = () => setIsOpen(!isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button onClick={toggleDialog}>
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
          <DialogTitle>Eliminar Partido</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          ¿Estás seguro de que quieres eliminar este partido?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={toggleDialog}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={onDeleteMatch}
            disabled={deleteMatchMutation.isPending}
          >
            {deleteMatchMutation.isPending ? "Eliminando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
