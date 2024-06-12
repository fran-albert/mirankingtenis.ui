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
import { Match } from "@/modules/match/domain/Match";
import { IoTennisballSharp } from "react-icons/io5";
import { createApiMatchRepository } from "@/modules/match/infra/ApiMatchRepository";
import { decideMatch } from "@/modules/match/application/decide-match/decideMatch";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const toggleDialog = () => setIsOpen(!isOpen);

  const selectPlayer = (playerId: number) => {
    setSelectedPlayer(playerId === selectedPlayer ? null : playerId);
  };

  const onSubmit = async () => {
    if (selectedPlayer === null) {
      console.error("No se ha seleccionado ningún jugador.");
      return;
    }

    const winnerUserId = Number(selectedPlayer);
    if (isNaN(winnerUserId)) {
      console.error("El ID del jugador seleccionado no es un número válido.");
      return;
    }

    try {
      const result = await decideMatchFn(match.id, winnerUserId);
      console.log("Resultado de la operación:", result);
      toast.success("Partido decidido con éxito");
      onMatchDecided?.();
      toggleDialog();
    } catch (error) {
      console.error("Error al decidir el partido", error);
      toast.error("Error al decidir el partido");
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
            tooltip="Decidir Partido"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Decidir Partido</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => e.preventDefault()}>
          <DialogDescription>
            <div
              className="cursor-pointer p-2"
              onClick={() => selectPlayer(match.idUser1)}
            >
              <Badge
                className={`${
                  selectedPlayer === match.idUser1
                    ? "bg-green-500 text-gray-900 font-bold"
                    : "bg-gray-300 text-gray-900 font-bold"
                }`}
              >
                {match?.user1.toString()}
              </Badge>
            </div>
            <div
              className="cursor-pointer p-2"
              onClick={() => selectPlayer(match.idUser2)}
            >
              <Badge
                className={`${
                  selectedPlayer === match.idUser2
                    ? "bg-green-500 text-gray-900 font-bold"
                    : "bg-gray-300 text-gray-900 font-bold"
                }`}
              >
               {match?.user2.toString()}
              </Badge>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={toggleDialog}>
              Cancelar
            </Button>
            <Button variant="green" onClick={onSubmit}>
              Confirmar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
