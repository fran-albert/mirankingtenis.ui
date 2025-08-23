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
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "sonner";
import { useCategoryMutations } from "@/hooks/Category";
import { Category } from "@/types/Category/Category";

interface DeleteCategoryDialogProps {
  category: Category;
  removeCategoryFromList?: (idSpeciality: number) => void;
}

export default function DeleteCategoryDialog({
  category,
  removeCategoryFromList,
}: DeleteCategoryDialogProps) {
  const { deleteCategoryMutation } = useCategoryMutations();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleDialog = () => setIsOpen(!isOpen);

  const handleConfirmDelete = async () => {
    try {
      deleteCategoryMutation.mutate(Number(category.id), {
        onSuccess: () => {
          toast.success("Categoría eliminada con éxito!");
          setIsOpen(false);
          if (removeCategoryFromList) {
            removeCategoryFromList(Number(category.id));
          }
        },
        onError: (error) => {
          toast.error("Error al eliminar la Categoría");
          console.error("Error al eliminar la Categoría", error);
        },
      });
    } catch (error) {
      console.error("Error al eliminar la Categoría", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-red-700 hover:bg-red-500 ml-2"
          onClick={toggleDialog}
        >
          Eliminar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar {category.name}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          ¿Estás seguro de que quieres eliminar la especialidad {category.name}?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={toggleDialog}>
            Cancelar
          </Button>
          <Button variant="default" onClick={handleConfirmDelete}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
