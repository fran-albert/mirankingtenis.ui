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
import { useCategoryMutations } from "@/hooks/Category";
import { Category } from "@/types/Category/Category";

interface AddCategoriesDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCategoryAdded: (newCategory: Category) => void;
}

interface Inputs extends Category {}

export default function AddCategoriesDialog({
  isOpen,
  onCategoryAdded,
  setIsOpen,
}: AddCategoriesDialogProps) {
  const { createCategoryMutation } = useCategoryMutations();
  
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
      createCategoryMutation.mutate(data, {
        onSuccess: (newCategory) => {
          toast.success("Categoría creada con éxito!");
          setIsOpen(false);
          reset();
          onCategoryAdded(newCategory);
        },
        onError: (error) => {
          toast.error("Error al crear la Categoría");
          console.error("Error al crear la Categoría", error);
        },
      });
    } catch (error) {
      console.error("Error al crear la Categoría", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Categoría</DialogTitle>
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
