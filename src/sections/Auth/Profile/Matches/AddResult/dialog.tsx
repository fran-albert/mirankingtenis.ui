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
import { useCreateSets } from "@/hooks/Sets/useSet";
import axios from "axios";
import { MdScoreboard } from "react-icons/md";
import ActionIcon from "@/components/ui/actionIcon";
import { MatchByUserWithRival } from "@/types/Match/MatchByUser.dto";
import "./dialog.style.css";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AddResultMatchDialogProps {
  onUpdateMatches?: () => void;
  match: MatchByUserWithRival;
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
  const createSetsMutation = useCreateSets();

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
      tournamentCategoryId: match.fixture?.tournamentCategories?.id,
    };
    try {
      const setCreationPromise = createSetsMutation.mutateAsync(dataToSend);
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
    setIsConfirmOpen(false);
    setIsAddResultOpen(false);
    reset();
  };

  const closeAndResetDialog = () => {
    setIsAddResultOpen(false);
    reset();
  };

  return (
    <>
      {/* <div className="sm:max-w-full">
        <Dialog open={isAddResultOpen} onOpenChange={setIsAddResultOpen}>
          <DialogContent className="dialog-content">
            <DialogHeader>
              <DialogTitle>Insertar Resultado del Partido</DialogTitle>
              <DialogDescription>
                Ingresa los resultados del partido vs {match.rivalName}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="overflow-hidden">
                <div className="px-2 py-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 bg-gray-50">
                    <thead>
                      <tr>
                        <th className="text-center text-gray-900 uppercase text-sm">
                          SETS
                        </th>
                        <th className="text-center text-gray-900 uppercase text-sm">
                          {match.user1Name}
                        </th>
                        <th className="text-center text-gray-900 uppercase text-sm">
                          -
                        </th>
                        <th className="text-center text-gray-900 uppercase text-sm">
                          {match.user2Name}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center ">
                      {["1° Set", "2° Set", "Super Tie-Break"].map(
                        (set, index) => (
                          <tr key={index}>
                            <td className="table-cell text-gray-900 whitespace-nowrap">
                              {set}
                            </td>
                            <td className="table-cell">
                              <input
                                type="number"
                                {...register(`sets.${index}.pointsPlayer1`)}
                                className="input-number border-2 border-slate-600 rounded text-center no-spinners"
                                required
                                defaultValue={
                                  set === "Super Tie-Break" ? 0 : ""
                                }
                              />
                            </td>
                            <td className="table-cell">-</td>
                            <td className="table-cell">
                              <input
                                type="number"
                                {...register(`sets.${index}.pointsPlayer2`)}
                                className="input-number border-2 border-slate-600 rounded text-center no-spinners"
                                required
                                defaultValue={
                                  set === "Super Tie-Break" ? 0 : ""
                                }
                              />
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <DialogFooter className="flex flex-col space-y-4 w-1/2 mx-auto sm:flex-row sm:space-y-0 sm:space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  className="button w-full md:w-auto"
                  onClick={closeAndResetDialog}
                >
                  Cancelar
                </Button>
                <Button className="button bg-slate-700" type="submit">
                  Siguiente
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div> */}

      <Dialog open={isAddResultOpen} onOpenChange={setIsAddResultOpen}>
        <DialogTrigger asChild>
          <Button variant="green" type="button">
            Resultado
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Resultados del Partido de Tenis</DialogTitle>
            <DialogDescription>
              Ingresa los puntajes de cada set para el partido vs{" "}
              {match.user2?.name} {match.user2?.lastname}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-5 items-center gap-4">
                <Label htmlFor="player1" className="col-span-2 text-right">
                  {match.user1.name} {match.user1.lastname}
                </Label>
                <div className="col-span-1" />
                <Label htmlFor="player2" className="col-span-2 text-left">
                  {match.user2?.name} {match.user2?.lastname}
                </Label>
              </div>
              <div className="grid grid-cols-5 gap-4 items-center">
                <div className="col-span-1 text-right">Set 1</div>
                <Input
                  id="set1-player1"
                  type="number"
                  {...register("sets.0.pointsPlayer1")}
                  min="0"
                  className="col-span-1"
                />
                <div className="col-span-1 text-center">-</div>
                <Input
                  id="set1-player2"
                  type="number"
                  {...register("sets.0.pointsPlayer2")}
                  min="0"
                  className="col-span-1"
                />
              </div>
              <div className="grid grid-cols-5 gap-4 items-center">
                <div className="col-span-1 text-right">Set 2</div>
                <Input
                  id="set2-player1"
                  type="number"
                  {...register("sets.1.pointsPlayer1")}
                  min="0"
                  max="7"
                  className="col-span-1"
                />
                <div className="col-span-1 text-center">-</div>
                <Input
                  id="set2-player2"
                  type="number"
                  min="0"
                  {...register("sets.1.pointsPlayer2")}
                  max="7"
                  className="col-span-1"
                />
              </div>
              <div className="grid grid-cols-5 gap-4 items-center">
                <div className="col-span-1 text-right">Super Tie Break</div>
                <Input
                  id="set3-player1"
                  type="number"
                  min="0"
                  defaultValue={0}
                  {...register("sets.2.pointsPlayer1")}
                  className="col-span-1"
                />
                <div className="col-span-1 text-center">-</div>
                <Input
                  id="set3-player2"
                  type="number"
                  min="0"
                  defaultValue={0}
                  {...register("sets.2.pointsPlayer2")}
                  className="col-span-1"
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col space-y-4 w-1/2 mx-auto sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button
                type="button"
                variant="outline"
                className="button w-full md:w-auto"
                onClick={closeAndResetDialog}
              >
                Cancelar
              </Button>
              <Button className="button bg-slate-700" type="submit">
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
                      {match.user1.name} {match.user1.lastname} vs{" "}
                      {match.user2?.name} {match.user2?.lastname}
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
