"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { es } from "date-fns/locale/es";
import { CourtSelect } from "@/components/Select/Court/select";
import { createApiShiftRepository } from "@/modules/shift/infra/ApiShiftRepository";
import { shiftForMatch } from "@/modules/shift/application/shift-for-match/shiftForMatch";
import { useMatchStore } from "@/hooks/useMatchStore";

interface EidtMatchDialogProps {
  updateMatches?: () => void;
  isOpen: boolean;
  onClose?: () => void;
}

export default function AddShiftDialog({
  isOpen,
  updateMatches,
  onClose,
}: EidtMatchDialogProps) {
  const { selectedMatch: match } = useMatchStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const shiftRepository = createApiShiftRepository();
  const shiftForMatchFn = shiftForMatch(shiftRepository);
  const [selectedCourt, setSelectedCourt] = useState<string>();

  const onSubmit = async (data: any, event?: React.BaseSyntheticEvent) => {
    if (event) {
      event.preventDefault();
    }
    const { date, time, court } = data;
    const startHour = new Date(`${date}T${time}:00Z`).toISOString();
    const dataToSend: any = {
      idCourt: Number(data.idCourt),
      startHour: startHour,
    };
    try {
      const shiftCreationPromise = shiftForMatchFn(dataToSend, match.id);
      toast.promise(shiftCreationPromise, {
        loading: "Reservando turno para el partido...",
        success: "Turno reservado con éxito!",
        duration: 3000,
      });
      await shiftCreationPromise;
      if (updateMatches) {
        updateMatches();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Error desconocido al reservar el partido";
        toast.error(`Error al reservar el partido: ${errorMessage}`, {
          duration: 3000,
        });
        console.error("Error al reservar el partido", errorMessage);
      } else {
        toast.error("Error al reservar el partido: Error desconocido", {
          duration: 3000,
        });
        console.error("Error al reservar el partido", error);
      }
    }
    onClose?.();
  };

  const handleCourtSelection = (value: string) => {
    setSelectedCourt(value);
    setValue("idCourt", value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <section className="w-full max-w-md bg-white p-6 flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold">Reservar Turno</h2>
            <div>
              <Label className="mb-2" htmlFor="court">
                Cancha
              </Label>
              <Select onValueChange={handleCourtSelection}>
                <SelectTrigger id="court">
                  <SelectValue placeholder="Seleccionar cancha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Cancha 1</SelectItem>
                  <SelectItem value="2">Cancha 2</SelectItem>
                  <SelectItem value="3">Cancha 3</SelectItem>
                  <SelectItem value="4">Cancha 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2" htmlFor="date">
                  Fecha
                </Label>
                <Input
                  id="date"
                  type="date"
                  {...register("date", { required: true })}
                />
              </div>
              <div>
                <Label className="mb-2" htmlFor="time">
                  Hora
                </Label>
                <Input
                  id="time"
                  type="time"
                  {...register("time", { required: true })}
                />
              </div>
            </div>
          </section>
          <DialogFooter className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto px-4 py-2 text-sm"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              className="bg-slate-500 hover:bg-slate-600 text-white"
              type="submit"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
