"use client";

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
import { toast } from "sonner";
import { useForm, SubmitHandler } from "react-hook-form";
import { createApiSetsRepository } from "@/modules/sets/infra/ApiSetsRepository";
import { createSets } from "@/modules/sets/application/create/createSets";
import axios from "axios";
import { MdScoreboard } from "react-icons/md";
import ActionIcon from "@/components/ui/actionIcon";
import { Match } from "@/modules/match/domain/Match";

interface AddResultMatchDialogProps {
  onUpdateMatches?: () => void;
  match: Match;
}

export default function AddResultMatchDialog({
  match,
  onUpdateMatches,
}: AddResultMatchDialogProps) {
  const [isAddResultOpen, setIsAddResultOpen] = useState<boolean>(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>(null);
  const toggleAddResultDialog = () => setIsAddResultOpen(!isAddResultOpen);
  const toggleConfirmDialog = () => setIsConfirmOpen(!isConfirmOpen);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const setRepository = createApiSetsRepository();
  const createSetFn = createSets(setRepository);

  const onSubmit: SubmitHandler<any> = async (formData) => {
    setFormData(formData);
    toggleConfirmDialog();
  };
  const onConfirm = async () => {
    const dataToSend: any = {
      idMatch: match.id,
      sets: Object.values(formData.sets).map((set: any, index) => ({
        pointsPlayer1: parseInt(set.pointsPlayer1, 10),
        pointsPlayer2: parseInt(set.pointsPlayer2, 10),
        setNumber: index + 1,
      })),
    };
    try {
      const setCreationPromise = createSetFn(dataToSend);
      toast.promise(setCreationPromise, {
        loading: "Actualizando partido...",
        success: "Partido actualizado con éxito!",
        duration: 3000,
      });
      await setCreationPromise;
      if (onUpdateMatches) {
        onUpdateMatches();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Error desconocido al actualizar el partido";
        toast.error(`Error al crear el set: ${errorMessage}`, {
          duration: 3000,
        });
        console.error("Error al crear el set", errorMessage);
      } else {
        toast.error("Error al crear el set: Error desconocido", {
          duration: 3000,
        });
        console.error("Error al crear el set", error);
      }
    }
    setIsConfirmOpen(false); // Cierra el diálogo de confirmación
    setIsAddResultOpen(false);
    reset();
  };

  const closeAndResetDialog = () => {
    setIsAddResultOpen(false);
    reset();
  };

  return (
    <>
      <Dialog open={isAddResultOpen} onOpenChange={setIsAddResultOpen}>
        <DialogTrigger asChild>
          <Button variant="green" className="text-xs">
            Resultado
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-xl mx-auto">
          <DialogHeader>
            <DialogTitle>Insertar Resultado del Partido</DialogTitle>
            <DialogDescription>
              Ingresa los resultados del partido vs {match.rivalName}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className=" overflow-hidden max-w-full">
              <div className="px-2 py-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 bg-gray-50">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 text-xs md:text-sm font-medium text-center text-gray-900 uppercase">
                        SETS
                      </th>
                      <th className="py-2 px-4 text-xs md:text-sm font-medium text-center text-gray-900 uppercase">
                        {match.user1Name}
                      </th>
                      <th className="py-2 px-4 text-xs md:text-sm font-medium text-center text-gray-900 uppercase"></th>
                      <th className="py-2 px-4 text-xs md:text-sm font-medium text-center text-gray-900 uppercase">
                        {match.user2Name}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-center font-medium">
                    {["1° Set", "2° Set", "Super Tie-Break"].map(
                      (set, index) => (
                        <tr key={index}>
                          <td className="py-4 px-6 text-sm text-gray-900 whitespace-nowrap">
                            {set}
                          </td>
                          <td className="py-4 px-6">
                            <input
                              type="number"
                              {...register(`sets.${index}.pointsPlayer1`)}
                              className="text-black border-2 border-slate-600 rounded w-11 text-center no-spinners"
                              required
                              defaultValue={set === "Super Tie-Break" ? 0 : ""}
                            />
                          </td>
                          <td className="">-</td>
                          <td className="py-4 px-6">
                            <input
                              type="number"
                              {...register(`sets.${index}.pointsPlayer2`)}
                              className="text-black border-2 border-slate-600 rounded w-11 text-center no-spinners"
                              required
                              defaultValue={set === "Super Tie-Break" ? 0 : ""}
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <DialogFooter className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mt-2">
              <Button
                type="button"
                variant="outline"
                className="w-full md:w-auto"
                onClick={() => closeAndResetDialog()}
              >
                Cancelar
              </Button>
              <Button className="bg-slate-700" type="submit">
                Siguiente
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {formData && formData.sets && (
        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Cambios</DialogTitle>
            </DialogHeader>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <p className="text-sm text-center mb-2">
                Por favor, confirma los resultados del partido:
              </p>
              <div className="border-t border-gray-200"></div>
              <div className="mt-2">
                <div className="mt-2">
                  <p className="text-md font-medium text-gray-800">
                    <span className="font-normal">
                      {match.user1Name} vs {match.user2Name}
                    </span>
                  </p>
                  <ul className="mt-2 space-y-1">
                    {formData.sets.map((set: any, index: any) => (
                      <li key={index} className="flex justify-between">
                        <span className="text-gray-600">{index + 1}° Set:</span>
                        <span className="font-semibold">
                          {set.pointsPlayer1} - {set.pointsPlayer2}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button
                type="button"
                variant="outline"
                className="w-full md:w-auto"
                onClick={() => setIsConfirmOpen(false)}
              >
                Cancelar
              </Button>
              <Button className="bg-slate-700" onClick={onConfirm}>
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
