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
import { Match } from "@/types/Match/Match";
import { IoTennisballSharp } from "react-icons/io5";
// React Query hook is imported above
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useDecideMatch } from "@/hooks/Matches/useMatches";
import { isAxiosError } from "axios";

interface DecideMatchDialogProps {
  match: Match;
  onMatchDecided?: () => void;
  tournamentCategoryId: number;
}

export default function DecideMatchDialog({
  match,
  tournamentCategoryId,
  onMatchDecided,
}: DecideMatchDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutate: decideMatchMutation } = useDecideMatch();
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
      const matchPromise = new Promise((resolve, reject) => {
        decideMatchMutation(
          {
            id: match.id,
            winnerUserId,
            tournamentCategoryId
          },
          {
            onSuccess: () => {
              if (onMatchDecided) {
                onMatchDecided();
              }
              setIsOpen(false);
              resolve(true);
            },
            onError: (error) => {
              reject(error);
            }
          }
        );
      });
      
      toast.promise(matchPromise, {
        loading: "Decidiendo...",
        success: "Partido decidido con éxito!",
        error: (err) => {
          if (isAxiosError(err)) {
            return err?.response?.data.message || "Error al decidir partido";
          }
          return "Error al decidir partido";
        },
        duration: 3000,
      });
      
      await matchPromise;
    } catch (error) {
      console.error("Error al decidir partido", error);
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
                {match?.user2?.toString()}
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
