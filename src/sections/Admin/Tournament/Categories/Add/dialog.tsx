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
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Category } from "@/types/Category/Category";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAllCategories } from "@/hooks/Category";
import { toast } from "sonner";
import { PlayoffRound, TournamentCategory } from "@/types/Tournament-Category/TournamentCategory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddCategoriesForTournamentDialogProps {
  createCategoryForTournament: (
    idTournament: number,
    idCategory: number[],
    skipGroupStage?: boolean,
    startingPlayoffRound?: PlayoffRound
  ) => Promise<TournamentCategory[]>;
  idTournament: number;
  onClose: (createdCategories: TournamentCategory[]) => void;
  existingCategories: number[];
  isMasterTournament?: boolean;
}
interface Inputs {
  tournamentId: number;
  categoryIds: number[];
  skipGroupStage: boolean;
  startingPlayoffRound?: PlayoffRound;
}

export default function AddCategoriesForTournamentDialog({
  createCategoryForTournament,
  idTournament,
  onClose,
  existingCategories,
  isMasterTournament = false,
}: AddCategoriesForTournamentDialogProps) {
  const { categories } = useAllCategories();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleDialog = () => setIsOpen(!isOpen);

  const { control, handleSubmit, reset, setValue, getValues, watch } = useForm<Inputs>(
    {
      defaultValues: {
        tournamentId: idTournament,
        categoryIds: [],
        skipGroupStage: false,
        startingPlayoffRound: undefined,
      },
    }
  );

  const skipGroupStage = watch("skipGroupStage");

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      // Validación: si skip es true, debe tener ronda seleccionada
      if (data.skipGroupStage && !data.startingPlayoffRound) {
        toast.error("Debes seleccionar una ronda inicial para playoffs directos");
        return;
      }

      const categoryCreationPromise = createCategoryForTournament(
        idTournament,
        data.categoryIds,
        data.skipGroupStage,
        data.startingPlayoffRound
      );

      toast.promise(categoryCreationPromise, {
        loading: "Creando categoría...",
        success: "Categoría creada con éxito!",
        error: "Error al crear la categoría",
      });

      const createdCategories = await categoryCreationPromise;
      setIsOpen(false);
      reset();
      onClose(createdCategories);
    } catch (error) {
      console.error("Error al crear la categoría", error);
    }
  };

  const availableCategories = categories.filter(
    (category) => !existingCategories.includes(category.id)
  );

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    const currentCategories = getValues("categoryIds");
    const updatedSelection = checked
      ? [...currentCategories, categoryId]
      : currentCategories.filter((id) => id !== categoryId);
    setValue("categoryIds", updatedSelection);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" onClick={toggleDialog}>
          Agregar Categoría
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Selecciona las categorías</DialogTitle>
          <DialogDescription>
            Elige las categorías que deseas.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              {availableCategories.map((category: Category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Controller
                    name="categoryIds"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value.includes(category.id)}
                        onCheckedChange={(checked) =>
                          handleCategoryChange(category.id, Boolean(checked))
                        }
                        id={`category-${category.id}`}
                      />
                    )}
                  />
                  <Label htmlFor={`category-${category.id}`}>
                    Categoría {category.name}
                  </Label>
                </div>
              ))}
            </div>

            {isMasterTournament && (
              <div className="border-t pt-4 mt-2">
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
                          id="skip-group-stage"
                        />
                      )}
                    />
                    <Label htmlFor="skip-group-stage" className="font-medium">
                      Saltar fase de grupos (Ir directo a playoffs)
                    </Label>
                  </div>

                  {skipGroupStage && (
                    <div className="space-y-2 pl-6">
                      <Label htmlFor="starting-round">Ronda inicial de playoffs</Label>
                      <Controller
                        name="startingPlayoffRound"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger id="starting-round">
                              <SelectValue placeholder="Selecciona una ronda" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="RoundOf16">Octavos de Final (16 jugadores)</SelectItem>
                              <SelectItem value="QuarterFinals">Cuartos de Final (8 jugadores)</SelectItem>
                              <SelectItem value="SemiFinals">Semifinales (4 jugadores)</SelectItem>
                              <SelectItem value="Finals">Final (2 jugadores)</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <p className="text-sm text-muted-foreground">
                        {skipGroupStage && getValues("startingPlayoffRound") === "RoundOf16" && "Requerirás 16 jugadores registrados"}
                        {skipGroupStage && getValues("startingPlayoffRound") === "QuarterFinals" && "Requerirás 8 jugadores registrados"}
                        {skipGroupStage && getValues("startingPlayoffRound") === "SemiFinals" && "Requerirás 4 jugadores registrados"}
                        {skipGroupStage && getValues("startingPlayoffRound") === "Finals" && "Requerirás 2 jugadores registrados"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Confirmar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
