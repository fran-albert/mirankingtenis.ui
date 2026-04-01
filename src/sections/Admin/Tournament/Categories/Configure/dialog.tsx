import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TournamentCategory } from "@/types/Tournament-Category/TournamentCategory";
import { useTournamentCategoryMutations } from "@/hooks/Tournament-Category/useTournamentCategory";

interface ConfigureTournamentCategoryDialogProps {
  tournamentId: number;
  category: TournamentCategory;
  onUpdated: (category: TournamentCategory) => void;
}

interface Inputs {
  skipGroupStage: boolean;
  startingPlayoffRound?: TournamentCategory["startingPlayoffRound"];
}

export default function ConfigureTournamentCategoryDialog({
  tournamentId,
  category,
  onUpdated,
}: ConfigureTournamentCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { updateTournamentCategoryConfigMutation } = useTournamentCategoryMutations();
  const { control, handleSubmit, reset, setValue, watch } = useForm<Inputs>({
    defaultValues: {
      skipGroupStage: category.skipGroupStage || false,
      startingPlayoffRound: category.startingPlayoffRound,
    },
  });

  const skipGroupStage = watch("skipGroupStage");

  useEffect(() => {
    if (isOpen) {
      reset({
        skipGroupStage: category.skipGroupStage || false,
        startingPlayoffRound: category.startingPlayoffRound,
      });
    }
  }, [category, isOpen, reset]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.skipGroupStage && !data.startingPlayoffRound) {
      toast.error("Debes seleccionar una ronda inicial para playoffs directos");
      return;
    }

    try {
      const updatedCategory = await updateTournamentCategoryConfigMutation.mutateAsync({
        tournamentId,
        categoryId: category.id,
        skipGroupStage: data.skipGroupStage,
        startingPlayoffRound: data.skipGroupStage
          ? data.startingPlayoffRound ?? null
          : null,
      });

      toast.success(`Configuración actualizada para categoría ${category.name}`);
      onUpdated(updatedCategory);
      setIsOpen(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "No se pudo actualizar la categoría"
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Configurar formato
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Categoría {category.name}</DialogTitle>
          <DialogDescription>
            Define si esta categoría usa fixture tradicional o va directo a playoffs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Controller
                name="skipGroupStage"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (!checked) {
                        setValue("startingPlayoffRound", undefined);
                      }
                    }}
                    id={`skip-group-stage-${category.id}`}
                  />
                )}
              />
              <Label
                htmlFor={`skip-group-stage-${category.id}`}
                className="font-medium"
              >
                Ir directo a playoffs
              </Label>
            </div>

            {skipGroupStage && (
              <div className="space-y-2 pl-6">
                <Label htmlFor={`starting-round-${category.id}`}>
                  Ronda inicial de playoffs
                </Label>
                <Controller
                  name="startingPlayoffRound"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id={`starting-round-${category.id}`}>
                        <SelectValue placeholder="Selecciona una ronda" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RoundOf16">
                          Octavos de Final (16 jugadores)
                        </SelectItem>
                        <SelectItem value="QuarterFinals">
                          Cuartos de Final (8 jugadores)
                        </SelectItem>
                        <SelectItem value="SemiFinals">
                          Semifinales (4 jugadores)
                        </SelectItem>
                        <SelectItem value="Finals">
                          Final (2 jugadores)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={updateTournamentCategoryConfigMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateTournamentCategoryConfigMutation.isPending}
            >
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
