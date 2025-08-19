import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tournament } from "@/types/Tournament/Tournament";
import { useTournamentMutations } from "@/hooks/Tournament/useTournament";

interface AddTournamentDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addTournamentToList: (newCategory: Tournament) => void;
}

interface Inputs extends Tournament {}

export default function AddTournamentDialog({
  isOpen,
  addTournamentToList,
  setIsOpen,
}: AddTournamentDialogProps) {
  // Usar React Query mutation hook
  const { createTournamentMutation } = useTournamentMutations();
  const toggleDialog = () => {
    setIsOpen(!isOpen);
    reset();
  };
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const creationPromise = createTournamentMutation.mutateAsync(data);

      toast.promise(creationPromise, {
        loading: "Creando torneo...",
        success: "Torneo creado con éxito!",
        error: "Error al crear el Torneo",
      });

      creationPromise
        .then((createdTournament) => {
          setIsOpen(false);
          reset();
          addTournamentToList(createdTournament);
        })
        .catch((error) => {
          console.error("Error al crear el Torneo", error);
        });
    } catch (error) {
      console.error("Error al crear el Torneo", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Torneo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogDescription>
            <div className="flex flex-row mt-2">
              <div className="flex-1 pr-1">
                <div className="mb-2 block">
                  <Label htmlFor="name" className="text-black">
                    Nombre
                  </Label>
                  <Input
                    type="text"
                    className="text-black"
                    placeholder="Ingresa el nombre del torneo"
                    {...register("name", { required: true })}
                  />
                </div>
                <div className="mb-2 block">
                  <Label htmlFor="type" className="text-black">
                    Tipo
                  </Label>
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="text-black">
                          <SelectValue placeholder="Seleccione el tipo..." />
                        </SelectTrigger>
                        <SelectContent className="text-black">
                          <SelectItem value="master">Master</SelectItem>
                          <SelectItem value="league">Liga</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={toggleDialog}>
              Cancelar
            </Button>
            <Button variant="default" type="submit">
              Confirmar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
