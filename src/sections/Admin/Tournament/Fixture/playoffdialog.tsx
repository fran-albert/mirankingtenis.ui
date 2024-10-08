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
import { useFixtureStore } from "@/hooks/useFixture";

interface CreatePlayOffForCategoryProps {
  idTournament: number;
  onFixtureCreated?: (idCategory: number) => void;
  idCategory: number;
}

export default function CreatePlayOffForCategory({
  idTournament,
  idCategory,
  onFixtureCreated,
}: CreatePlayOffForCategoryProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleDialog = () => setIsOpen(!isOpen);
  const { createPlayOff } = useFixtureStore();

  const isAxiosError = (
    error: any
  ): error is { response: { data: { message: string } } } => {
    return (
      error &&
      error.response &&
      error.response.data &&
      typeof error.response.data.message === "string"
    );
  };

  const handleConfirmCreate = async () => {
    try {
      const catPromise = createPlayOff(idTournament, idCategory);
      toast.promise(catPromise, {
        loading: "Creando...",
        success: "Playoffs creado con éxito!",
        error: (err) => {
          if (isAxiosError(err)) {
            return err.response.data.message || "Error al crear el PlayOff";
          }
          return "Error al crear el PlayOff";
        },
        duration: 3000,
      });
      await catPromise;
      if (onFixtureCreated) {
        onFixtureCreated(idCategory);
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Error al crear el PlayOff", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-green-700 hover:bg-green-500 ml-2"
          onClick={toggleDialog}
        >
          Próxima Ronda
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Próxima Ronda</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          ¿Estás seguro de que quieres generar la próxima ronda del Master para
          la categoría {idCategory}?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={toggleDialog}>
            Cancelar
          </Button>
          <Button variant="default" onClick={handleConfirmCreate}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
