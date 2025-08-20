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
import { useForm } from "react-hook-form";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import { Label } from "@/components/ui/label";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "@/components/ui/input";
import { es } from "date-fns/locale/es";
registerLocale("es", es);
import moment from "moment-timezone";
import { MatchByUserWithRival } from "@/types/Match/MatchByUser.dto";
import { useShiftMutation } from "@/hooks/Shift/useShiftMutation";

interface UpdateShiftDialogProps {
  onUpdateMatches?: () => void;
  match: MatchByUserWithRival;
}

export default function UpdateShiftDialog({
  match,
  onUpdateMatches,
}: UpdateShiftDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleDialog = () => setIsOpen(!isOpen);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const { updateShiftMutation } = useShiftMutation();
  const [selectedCourt, setSelectedCourt] = useState<string>("");

  useEffect(() => {
    if (match.shift?.court) {
      setSelectedCourt(match.shift.court.toString());
      setValue("idCourt", match.shift.court);
    }
    setValue("startHour", moment(match.shift?.startHour).utc().format());
    setValue("date", moment(match.shift?.startHour).format("YYYY-MM-DD"));
    setValue("time", moment(match.shift?.startHour).format("HH:mm"));
  }, [match, setValue]);

  const onSubmit = async (data: any) => {
    const { date, time, court } = data;
    const startHour = new Date(`${date}T${time}:00Z`).toISOString();
    const dataToSend: any = {
      idCourt: Number(data.idCourt),
      startHour: startHour,
    };

    updateShiftMutation.mutate(
      { newShift: dataToSend, idShift: match.shift?.id || 0 },
      {
        onSuccess: () => {
          toast.success("Turno actualizado con éxito!", { duration: 3000 });
          if (onUpdateMatches) {
            onUpdateMatches();
          }
          setIsOpen(false);
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message ||
            "Error desconocido al actualizar el turno";
          toast.error(`Error al actualizar el turno: ${errorMessage}`, {
            duration: 3000,
          });
          console.error("Error al actualizar el turno", error);
        }
      }
    );
  };

  const handleCourtSelection = (value: string) => {
    setSelectedCourt(value);
    setValue("idCourt", value);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={toggleDialog} variant="edit" className="text-xs">
            Editar Turno
          </Button>
        </DialogTrigger>
        <DialogContent className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <section className="w-full max-w-md bg-white p-6 flex flex-col space-y-4">
              <h2 className="text-2xl font-semibold">Nuevo Turno</h2>
              <div>
                <Label className="mb-2" htmlFor="court">
                  Cancha
                </Label>
                <Select
                  onValueChange={handleCourtSelection}
                  defaultValue={selectedCourt}
                >
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
    </>
  );
}
