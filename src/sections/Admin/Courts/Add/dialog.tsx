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
import { Category } from "@/types/Category/Category";
import { createApiCourtRepository } from "@/modules/court/infra/ApiCourtRepository";
import { createCourt } from "@/modules/court/application/create/createCourt";

interface AddCourtDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCourtAdded: (newCategory: Category) => void;
}

interface Inputs extends Category {}
const courtRepository = createApiCourtRepository();

export default function AddCourtDialog({
  isOpen,
  onCourtAdded,
  setIsOpen,
}: AddCourtDialogProps) {
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
      const createCatFn = createCourt(courtRepository);
      const specialityCreationPromise = createCatFn(data);

      toast.promise(specialityCreationPromise, {
        loading: "Creando cancha...",
        success: "Cancha creada con éxito!",
        error: "Error al crear la Cancha",
      });

      specialityCreationPromise
        .then(() => {
          setIsOpen(false);
          reset();
          onCourtAdded(data);
        })
        .catch((error) => {
          console.error("Error al crear la Cancha", error);
        });
    } catch (error) {
      console.error("Error al crear la Cancha", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Cancha</DialogTitle>
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
