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
import { TournamentCategory } from "@/types/Tournament-Category/TournamentCategory";

interface AddCategoriesForTournamentDialogProps {
  createCategoryForTournament: (
    idTournament: number,
    idCategory: number[]
  ) => Promise<TournamentCategory[]>;
  idTournament: number;
  onClose: (createdCategories: TournamentCategory[]) => void;
  existingCategories: number[];
}
interface Inputs {
  tournamentId: number;
  categoryIds: number[];
}

export default function AddCategoriesForTournamentDialog({
  createCategoryForTournament,
  idTournament,
  onClose,
  existingCategories, 
}: AddCategoriesForTournamentDialogProps) {
  const { categories } = useAllCategories();
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
    try {
      const categoryCreationPromise = createCategoryForTournament(
        idTournament,
        data.categoryIds
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
          </div>
          <DialogFooter>
            <Button type="submit">Confirmar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
