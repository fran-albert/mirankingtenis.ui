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
import { createApiCourtRepository } from "@/modules/court/infra/ApiCourtRepository";
import { deleteCourt } from "@/modules/court/application/delete/deleteCourt";
import { Court } from "@/modules/court/domain/Court";

interface DeleteCourtDialogProps {
  court: Court;
  removeCourtFromList?: (idSpeciality: number) => void;
}

export default function DeleteCourtDialog({
  court,
  removeCourtFromList,
}: DeleteCourtDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleDialog = () => setIsOpen(!isOpen);

  const handleConfirmDelete = async () => {
    try {
      const courtRepository = createApiCourtRepository();
      const deleteCourtFn = deleteCourt(courtRepository);
      const courtPromise = deleteCourtFn(Number(court.id));
      toast.promise(courtPromise, {
        loading: "Eliminando cancha...",
        success: "Cancha eliminada con éxito!",
        error: "Error al eliminar la Cancha",
        duration: 3000,
      });
      courtPromise
        .then(() => {
          setIsOpen(false);
          if (removeCourtFromList) {
            removeCourtFromList(Number(court.id));
          }
        })
        .catch((error) => {
          console.error("Error al crear la Cancha", error);
        });
    } catch (error) {
      console.error("Error al crear la Cancha", error);
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
          <DialogTitle>Eliminar {court.name}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          ¿Estás seguro de que quieres eliminar la cancha {court.name}?
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
