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
import { useForm, SubmitHandler } from "react-hook-form";
import { Category } from "@/modules/category/domain/Category";
import { createApiCategoryRepository } from "@/modules/category/infra/ApiCategoryRepository";
import { createCategory } from "@/modules/category/application/create/createCategory";
import { Tournament } from "@/modules/tournament/domain/Tournament";
import { createApiTournamentRepository } from "@/modules/tournament/infra/ApiTournamentRepository";
import { createTournament } from "@/modules/tournament/application/create/createTournament";

interface AddTournamentDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addTournamentToList: (newCategory: Tournament) => void;
}

interface Inputs extends Tournament {}
const tournamentRepository = createApiTournamentRepository();

export default function AddTournamentDialog({
  isOpen,
  addTournamentToList,
  setIsOpen,
}: AddTournamentDialogProps) {
  const toggleDialog = () => {
    setIsOpen(!isOpen);
    reset();
  };
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const createCatFn = createTournament(tournamentRepository);
      const specialityCreationPromise = createCatFn(data);

      toast.promise(specialityCreationPromise, {
        loading: "Creando torneo...",
        success: "Torneo creado con éxito!",
        error: "Error al crear el Torneo",
      });

      specialityCreationPromise
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
                <div className="mb-2 block ">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    {...register("name", { required: true })}
                    className="bg-gray-200 text-gray-700"
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
