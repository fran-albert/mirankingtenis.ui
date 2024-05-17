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

import { Category } from "@/modules/category/domain/Category";
import { createApiCategoryRepository } from "@/modules/category/infra/ApiCategoryRepository";
import { deleteCategory } from "@/modules/category/application/delete/deleteCategory";

interface DeleteCategoryDialogProps {
  category: Category;
  removeCategoryFromList?: (idSpeciality: number) => void;
}

export default function DeleteCategoryDialog({
  category,
  removeCategoryFromList,
}: DeleteCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleDialog = () => setIsOpen(!isOpen);

  const handleConfirmDelete = async () => {
    try {
      const categoryRepository = createApiCategoryRepository();
      const deleteSpecialityFn = deleteCategory(categoryRepository);
      const catPromise = deleteSpecialityFn(Number(category.id));
      toast.promise(catPromise, {
        loading: "Eliminando categoría...",
        success: "Categoría eliminada con éxito!",
        error: "Error al eliminar la Categoría",
        duration: 3000,
      });
      catPromise
        .then(() => {
          setIsOpen(false);
          if (removeCategoryFromList) {
            removeCategoryFromList(Number(category.id));
          }
        })
        .catch((error) => {
          console.error("Error al crear la Especialidad", error);
        });
    } catch (error) {
      console.error("Error al crear la Especialidad", error);
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
