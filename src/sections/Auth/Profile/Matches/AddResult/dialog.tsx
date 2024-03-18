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
  const [isAddResultOpen, setIsAddResultOpen] = useState<boolean>(false); // Para el diálogo de agregar resultado
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false); // Para el diálogo de confirmación
  const [formData, setFormData] = useState<any>(null);
  const toggleAddResultDialog = () => setIsAddResultOpen(!isAddResultOpen);
  const toggleConfirmDialog = () => setIsConfirmOpen(!isConfirmOpen);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const setRepository = createApiSetsRepository();
  const createSetFn = createSets(setRepository);


  const onSubmit: SubmitHandler<any> = async (formData) => {
    setFormData(formData); // Guarda los datos del formulario
    toggleConfirmDialog(); // Abre el diálogo de confirmación directamente
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
  };

  return (
    <>
      <Dialog open={isAddResultOpen} onOpenChange={setIsAddResultOpen}>
        <DialogTrigger asChild>
          <Button variant="green">Resultado</Button>
        </DialogTrigger>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Insertar Resultado del Partido</DialogTitle>
            <DialogDescription>
              Ingresa los resultados del partido vs {match.rivalName}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                <table className="min-w-full w-full text-sm text-left text-gray-800 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="py-3 px-6 text-center">
                        Jugador
                      </th>
                      <th scope="col" className="py-3 px-6 text-center">
                        1° Set
                      </th>
                      <th scope="col" className="py-3 px-6 text-center">
                        2° Set
                      </th>
                      <th scope="col" className="py-3 px-6 text-center">
                        Super Tiebreak
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Jugador 1 */}
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 font-bold">
                      <td className="py-4 px-6">{match.user1Name}</td>
                      {/* Primer set */}
                      <td className="py-4 px-6">
                        <input
                          {...register("sets.0.pointsPlayer1")}
                          type="number"
                          min="0"
                          max="7"
                          required
                          className="input input-bordered w-full sm:max-w-sm"
                        />
                        {/* Considera si necesitas registrar tiebreak aquí como un checkbox o un input oculto */}
                      </td>
                      {/* Segundo set */}
                      <td className="py-4 px-6">
                        <input
                          {...register("sets.1.pointsPlayer1")}
                          type="number"
                          min="0"
                          max="7"
                          required
                          className="input input-bordered w-full sm:max-w-sm"
                        />
                      </td>
                      {/* Super Tiebreak */}
                      <td className="py-4 px-6">
                        <input
                          {...register("sets.2.pointsPlayer1")}
                          type="number"
                          min="0"
                          max="10"
                          className="input input-bordered w-full sm:max-w-sm"
                        />
                      </td>
                    </tr>
                    {/* Jugador 2 */}
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 font-bold">
                      <td className="py-4 px-6">{match.user2Name}</td>
                      {/* Primer set */}
                      <td className="py-4 px-6">
                        <input
                          {...register("sets.0.pointsPlayer2")}
                          type="number"
                          min="0"
                          max="7"
                          required
                          className="input input-bordered w-full max-w-sm"
                        />
                      </td>
                      {/* Segundo set */}
                      <td className="py-4 px-6">
                        <input
                          {...register("sets.1.pointsPlayer2")}
                          type="number"
                          min="0"
                          max="7"
                          required
                          className="input input-bordered w-full max-w-sm"
                        />
                      </td>
                      {/* Super Tiebreak */}
                      <td className="py-4 px-6">
                        <input
                          {...register("sets.2.pointsPlayer2")}
                          type="number"
                          min="0"
                          max="10"
                          className="input input-bordered w-full max-w-sm"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <DialogFooter className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button
                type="button"
                variant="outline"
                className="w-full md:w-auto"
                onClick={() => setIsAddResultOpen(false)}
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

      {isConfirmOpen && (
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
                    <li className="flex justify-between">
                      <span className="text-gray-600">1° Set:</span>
                      <span className="font-semibold">
                        {formData.sets[0].pointsPlayer1} -{" "}
                        {formData.sets[0].pointsPlayer2}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">2° Set:</span>
                      <span className="font-semibold">
                        {formData.sets[1].pointsPlayer1} -{" "}
                        {formData.sets[1].pointsPlayer2}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Super Tiebreak:</span>
                      <span className="font-semibold">
                        {formData.sets[2].pointsPlayer1} -{" "}
                        {formData.sets[2].pointsPlayer2}
                      </span>
                    </li>
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

      {/* <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <form onSubmit={handleSubmit(onSubmit)}></form>
      </Dialog>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={toggleDialog} variant="outline" size="icon">
            <ActionIcon
              icon={
                <MdScoreboard
                  size={30}
                  className="text-green-500 hover:text-green-700"
                />
              }
              tooltip="Insertar Resultado"
            />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar Partido</DialogTitle>
            <DialogDescription>
              Edita el resultado del partido vs {match.rivalName}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4"></div>
            <DialogFooter className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button
                type="button"
                variant="outline"
                className="w-full md:w-auto"
                onClick={toggleDialog}
              >
                Cancelar
              </Button>
              <Button className="bg-slate-700" type="submit">
                Confirmar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {isConfirmOpen && (
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
                <p className="text-md font-medium text-gray-800">
                  <span className="font-normal">
                    {match.user1Name} vs {match.user2Name}
                  </span>
                </p>
                <ul className="mt-2 space-y-1">
                  <li className="flex justify-between">
                    <span className="text-gray-600">1° Set:</span>
                    <span className="font-semibold">
                      {formData.sets[0].pointsPlayer1} -{" "}
                      {formData.sets[0].pointsPlayer2}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">2° Set:</span>
                    <span className="font-semibold">
                      {formData.sets[1].pointsPlayer1} -{" "}
                      {formData.sets[1].pointsPlayer2}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Super Tiebreak:</span>
                    <span className="font-semibold">
                      {formData.sets[2].pointsPlayer1} -{" "}
                      {formData.sets[2].pointsPlayer2}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <DialogFooter className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full md:w-auto"
                  onClick={toggleDialog}
                >
                  Cancelar
                </Button>
                <Button className="bg-slate-700" onClick={onConfirm}>
                  Actualizar partido
                </Button>
              </DialogFooter>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )} */}
    </>
  );
}
