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
import { FaPowerOff } from "react-icons/fa6";
import { toast } from "sonner";
import { createApiTournamentParticipantRepository } from "@/modules/tournament-participant/infra/ApiTournamentRepository";
import { desactivatePlayer } from "@/modules/tournament-participant/application/desactivate-player/desactivatePlayer";
import { Tournament } from "@/types/Tournament/Tournament";
import { useTournamentMutations } from "@/hooks/Tournament/useTournament";
import axios from "axios";
import { isAxiosError } from "@/common/helpers/helpers";

interface StartTournamentDialogDialogProps {
  tournament: Tournament;
  onUpdateTournamentOnList?: (newTournament: any) => void;
}

export default function StartTournamentDialog({
  tournament,
  onUpdateTournamentOnList,
}: StartTournamentDialogDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleDialog = () => setIsOpen(!isOpen);
  const { startTournamentMutation } = useTournamentMutations();

  const handleConfirmStarted = async () => {
    try {
      const startPromise = startTournamentMutation.mutateAsync(tournament.id);
      toast.promise(startPromise, {
        loading: "Iniciando torneo...",
        success: "Torneo iniciado con éxito!",
        error: (err) => {
          if (isAxiosError(err)) {
            return err.response.data.message || "Error al inciar el torneo";
          }
          return "Error al inciar el torneo";
        },
        duration: 3000,
      });
      const updatedTournament = await startPromise;
      if (onUpdateTournamentOnList) {
        onUpdateTournamentOnList(updatedTournament);
      }
      setIsOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Error desconocido al iniciar el torneo";
        toast.error(`Error al iniciar el torneo: ${errorMessage}`, {
          duration: 1000,
        });
        console.error("Error al enviar los datos:", errorMessage);
      }
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-green-700 hover:bg-green-900"
          onClick={toggleDialog}
        >
          Iniciar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Iniciar Torneo</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-900">
          ¿Estás seguro de que quieres empezar el torneo
          <span className="font-bold"> &quot;{tournament.name}&quot;</span>?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={toggleDialog}>
            Cancelar
          </Button>
          <Button variant="green" onClick={handleConfirmStarted}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
