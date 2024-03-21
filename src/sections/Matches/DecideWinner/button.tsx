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
import { Match } from "@/modules/match/domain/Match";
import { IoTennisballSharp } from "react-icons/io5";
import { createApiMatchRepository } from "@/modules/match/infra/ApiMatchRepository";
import { decideMatch } from "@/modules/match/application/decide-match/decideMatch";
import { toast } from "sonner";

interface DecideMatchDialogProps {
  match: Match;
  onMatchDecided?: () => void;
}

export default function DecideMatchDialog({
  match,
  onMatchDecided,
}: DecideMatchDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const matchRepository = createApiMatchRepository();
  const decideMatchFn = decideMatch(matchRepository);
  const toggleDialog = () => setIsOpen(!isOpen);

  const handleDecideMatch = async () => {
    try {
      const decideMatchPromise = decideMatchFn(match.id);
      await decideMatchPromise;
      toast.success("Partido sorteado con éxito");
      onMatchDecided?.();
      toggleDialog();
    } catch (error) {
      console.error("Error al sortear el partido", error);
      toast.error("Error al sortear el partido");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button onClick={toggleDialog}>
          <ActionIcon
            icon={
              <IoTennisballSharp
                size={18}
                className="text-green-500 hover:text-green-700"
              />
            }
            tooltip="Eliminar"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sortear Partido</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          ¿Estás seguro de que quieres sortear este partido?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={toggleDialog}>
            Cancelar
          </Button>
          <Button variant="green" onClick={handleDecideMatch}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
