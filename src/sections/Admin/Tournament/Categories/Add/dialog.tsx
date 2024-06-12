import React, { useEffect, useState } from "react";
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
import { Tournament } from "@/modules/tournament/domain/Tournament";
import { createApiTournamentRepository } from "@/modules/tournament/infra/ApiTournamentRepository";
import { createTournament } from "@/modules/tournament/application/create/createTournament";
import { Category } from "@/modules/category/domain/Category";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCategoriesStore } from "@/hooks/useCategories";
import { toast } from "sonner";

interface AddCategoriesForTournamentDialogProps {
  createCategoryForTournament: (
    idTournament: number,
    idCategory: number[]
  ) => Promise<void>;
  idTournament: number;
}

interface Inputs {
  tournamentId: number;
  categoryIds: number[];
}

export default function AddCategoriesForTournamentDialog({
  createCategoryForTournament,
  idTournament,
}: AddCategoriesForTournamentDialogProps) {
  const { categories, fetchCategories } = useCategoriesStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleDialog = () => setIsOpen(!isOpen);

  const { control, handleSubmit, reset, setValue, getValues } = useForm<Inputs>(
    {
      defaultValues: {
        tournamentId: idTournament,
        categoryIds: [],
      },
    }
  );

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const payload = {
      idTournament: idTournament,
      idCategory: data.categoryIds,
    };
    try {
      toast.promise(
        createCategoryForTournament(idTournament, data.categoryIds),
        {
          loading: "Agregando categorías para el torneo...",
          success: "Categorías agregadas con éxito!",
          error: "Error al agregar las categorías al torneo.",
        }
      );
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error("Error al agregar las categorías al torneo.", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
              {categories.map((category: Category) => (
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
          </div>
          <DialogFooter>
            <Button type="submit">Confirmar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
