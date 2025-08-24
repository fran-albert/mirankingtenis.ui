import React, { useState, useEffect } from "react";
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
import { CreateTournamentRequest } from "@/api/Tournament/create";
import { useTournamentMutations } from "@/hooks/Tournament/useTournament";

interface AddTournamentDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addTournamentToList: (newCategory: Tournament) => void;
}

interface Inputs extends CreateTournamentRequest {
  configuration: {
    winnerPoints: number;
    loserPoints: number;
    decideMatchWinnerPoints: number;
    decideMatchLoserPoints: number;
  };
}

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
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();

  const watchedType = watch("type");

  // Set default configuration values based on tournament type
  useEffect(() => {
    if (watchedType === "league") {
      setValue("configuration", {
        winnerPoints: 10,
        loserPoints: 5,
        decideMatchWinnerPoints: 7,
        decideMatchLoserPoints: 0,
      });
    } else if (watchedType === "master") {
      setValue("configuration", {
        winnerPoints: 3,
        loserPoints: 0,
        decideMatchWinnerPoints: 7,
        decideMatchLoserPoints: 0,
      });
    }
  }, [watchedType, setValue]);

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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Torneo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogDescription>
            <div className="space-y-4 mt-4">
              {/* Tournament Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-black">
                    Nombre del Torneo
                  </Label>
                  <Input
                    type="text"
                    className="text-black"
                    placeholder="Ingresa el nombre del torneo"
                    {...register("name", { required: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-black">
                    Tipo de Torneo
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

              {/* Tournament Configuration */}
              {watchedType && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="text-lg font-semibold text-black mb-3">
                    Configuración de Puntos
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="winnerPoints" className="text-black">
                        Puntos para Ganador
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        className="text-black"
                        {...register("configuration.winnerPoints", { 
                          required: true,
                          valueAsNumber: true 
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="loserPoints" className="text-black">
                        Puntos para Perdedor
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        className="text-black"
                        {...register("configuration.loserPoints", { 
                          required: true,
                          valueAsNumber: true 
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="decideMatchWinnerPoints" className="text-black">
                        Puntos Ganador (DecideMatch)
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        className="text-black"
                        {...register("configuration.decideMatchWinnerPoints", { 
                          required: true,
                          valueAsNumber: true 
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="decideMatchLoserPoints" className="text-black">
                        Puntos Perdedor (DecideMatch)
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        className="text-black"
                        {...register("configuration.decideMatchLoserPoints", { 
                          required: true,
                          valueAsNumber: true 
                        })}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Los valores se ajustan automáticamente según el tipo de torneo seleccionado.
                  </p>
                </div>
              )}
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
