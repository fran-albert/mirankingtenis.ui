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

interface CreateFixtureForGroupProps {
  idTournament: number;
  onFixtureCreated?: (idCategory: number) => void;
  idCategory: number;
}

export default function CreateFixtureForGroup({
  idTournament,
  idCategory,
  onFixtureCreated,
}: CreateFixtureForGroupProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleDialog = () => setIsOpen(!isOpen);
  const { createFixtureGroup } = useFixtureStore();

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
      const catPromise = createFixtureGroup(idTournament, idCategory);
      toast.promise(catPromise, {
        loading: "Creando fixture...",
        success: "Fixture creado con éxito!",
        error: (err) => {
          if (isAxiosError(err)) {
            return err.response.data.message || "Error al crear el Fixture";
          }
          return "Error al crear el Fixture";
        },
        duration: 3000,
      });
      await catPromise;
      if (onFixtureCreated) {
        onFixtureCreated(idCategory);
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Error al crear el Fixture", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-green-700 hover:bg-green-500 ml-2"
          onClick={toggleDialog}
        >
          Generar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generar Fixture</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          ¿Estás seguro de que quieres generar el fixture del Master para la
          categoría {idCategory}?
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
