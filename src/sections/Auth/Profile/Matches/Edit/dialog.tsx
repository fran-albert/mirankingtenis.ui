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
import { FaTrashAlt } from "react-icons/fa";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import { deleteUser } from "@/modules/users/application/delete/deleteUser";
import { toast } from "sonner";
import { Match } from "@/modules/match/domain/Match";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { Sets } from "@/modules/sets/domain/Sets";
import { createApiSetsRepository } from "@/modules/sets/infra/ApiSetsRepository";
import { createSets } from "@/modules/sets/application/create/createSets";
import axios from "axios";

interface EidtMatchDialogProps {
  handlePlayerDeleted?: (idlayer: number) => void;
  match: Match;
}

export default function EditMatchDialog({
  handlePlayerDeleted,
  match,
}: EidtMatchDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleDialog = () => setIsOpen(!isOpen);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const setRepository = createApiSetsRepository();
  const createSetFn = createSets(setRepository);

  const onSubmit = async (formData: any) => {
    const dataToSend: any = {
      idMatch: match.id,
      sets: Object.values(formData.sets).map((set: any) => ({
        pointsPlayer1: parseInt(set.pointsPlayer1, 10),
        pointsPlayer2: parseInt(set.pointsPlayer2, 10),
        setNumber: parseInt(set.setNumber, 10),
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
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Error desconocido al actualizar el partido";
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={toggleDialog} variant="outline">
          Editar
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
          <div className="grid gap-4 py-4">
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="py-3 px-6"></th>
                    <th scope="col" className="py-3 px-6">
                      1er Set
                    </th>
                    <th scope="col" className="py-3 px-6">
                      2do Set
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Super Tiebreak
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Jugador 1 */}
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="py-4 px-6">Yo</td>
                    {/* Primer set */}
                    <td className="py-4 px-6">
                      <Input
                        {...register("sets.0.pointsPlayer1")}
                        type="number"
                        min="0"
                        max="7"
                        required
                        className="input"
                      />
                      <Input
                        {...register("sets.0.setNumber")}
                        type="hidden"
                        value="1"
                      />
                      {/* Considera si necesitas registrar tiebreak aquí como un checkbox o un input oculto */}
                    </td>
                    {/* Segundo set */}
                    <td className="py-4 px-6">
                      <Input
                        {...register("sets.1.pointsPlayer1")}
                        type="number"
                        min="0"
                        max="7"
                        required
                        className="input"
                      />
                      <Input
                        {...register("sets.1.setNumber")}
                        type="hidden"
                        value="2"
                      />
                      {/* Considera si necesitas registrar tiebreak aquí como un checkbox o un input oculto */}
                    </td>
                    {/* Super Tiebreak */}
                    <td className="py-4 px-6">
                      <Input
                        {...register("sets.2.pointsPlayer1")}
                        type="number"
                        min="0"
                        max="10"
                        defaultValue="0"
                        className="Input"
                      />
                      <Input
                        {...register("sets.2.setNumber")}
                        type="hidden"
                        value="3"
                      />
                    </td>
                  </tr>
                  {/* Jugador 2 */}
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="py-4 px-6">{match.rivalName}</td>
                    {/* Primer set */}
                    <td className="py-4 px-6">
                      <Input
                        {...register("sets.0.pointsPlayer2")}
                        type="number"
                        min="0"
                        max="7"
                        required
                        className="Input"
                      />
                    </td>
                    {/* Segundo set */}
                    <td className="py-4 px-6">
                      <Input
                        {...register("sets.1.pointsPlayer2")}
                        type="number"
                        min="0"
                        max="7"
                        required
                        className="Input"
                      />
                    </td>
                    {/* Super Tiebreak */}
                    <td className="py-4 px-6">
                      <Input
                        {...register("sets.2.pointsPlayer2")}
                        type="number"
                        min="0"
                        max="10"
                        className="Input"
                        defaultValue="0"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={toggleDialog}>
              Cancelar
            </Button>
            <Button className="bg-slate-700" type="submit">
              Confirmar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
