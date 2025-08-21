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
import { Tournament } from "@/types/Tournament/Tournament";
import { useTournamentMutations } from "@/hooks/Tournament/useTournament";
import axios from "axios";
import { isAxiosError } from "@/common/helpers/helpers";

interface FinishTournamentDialogDialogProps {
  tournament: Tournament;
  onUpdateTournamentOnList?: (newTournament: any) => void;
}

export default function FinishTournamentDialog({
  tournament,
  onUpdateTournamentOnList,
}: FinishTournamentDialogDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleDialog = () => setIsOpen(!isOpen);
  const { finishTournamentMutation } = useTournamentMutations();

  const handleConfirmFinished = async () => {
    try {
      const finishPromise = finishTournamentMutation.mutateAsync(tournament.id);
      toast.promise(finishPromise, {
        loading: "Finalizando torneo...",
        success: "Torneo finalizado con éxito!",
        error: (err) => {
          if (isAxiosError(err)) {
            return err.response.data.message || "Error al finalizar el torneo";
          }
          return "Error al finalizar el torneo";
        },
        duration: 3000,
      });
      const updatedTournament = await finishPromise;
      if (onUpdateTournamentOnList) {
        onUpdateTournamentOnList(updatedTournament);
      }
      setIsOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Error desconocido al finalizar el torneo";
        toast.error(`Error al finalizar el torneo: ${errorMessage}`, {
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
          className="bg-red-700 hover:bg-red-900"
          onClick={toggleDialog}
        >
          Finalizar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Finalizar Torneo</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-900">
          ¿Estás seguro de que quieres finalizar el torneo
          <span className="font-bold"> &quot;{tournament.name}&quot;</span>?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={toggleDialog}>
            Cancelar
          </Button>
          <Button variant="green" onClick={handleConfirmFinished}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
