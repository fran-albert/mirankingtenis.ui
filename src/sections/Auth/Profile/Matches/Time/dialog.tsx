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
import { IoTimeSharp } from "react-icons/io5";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { Label } from "@/components/ui/label";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "@/components/ui/input";
import { FaCalendarAlt } from "react-icons/fa";
import { es } from "date-fns/locale/es";
import { CourtSelect } from "@/components/Select/Court/select";
import { createApiShiftRepository } from "@/modules/shift/infra/ApiShiftRepository";
import { shiftForMatch } from "@/modules/shift/application/shift-for-match/shiftForMatch";
registerLocale("es", es);
import moment from "moment-timezone";
import { Match } from "@/modules/match/domain/Match";
const { setHours } = require("date-fns");
const { setMinutes } = require("date-fns");
interface EidtMatchDialogProps {
  onUpdateMatches?: () => void;
  match: Match;
}

export default function EditMatchDialog({
  match,
  onUpdateMatches,
}: EidtMatchDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const shiftRepository = createApiShiftRepository();
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const shitForMatchFn = shiftForMatch(shiftRepository);
  const [startDate, setStartDate] = useState(new Date());
  const [renderDatePicker, setRenderDatePicker] = useState<boolean>(false);
  const [selectedCourt, setSelectedCourt] = useState<string>();
  const includeTimes = [];
  for (let hour = 9; hour <= 20; hour++) {
    includeTimes.push(setHours(setMinutes(new Date(), 0), hour));
    includeTimes.push(setHours(setMinutes(new Date(), 15), hour));
    includeTimes.push(setHours(setMinutes(new Date(), 30), hour));
    includeTimes.push(setHours(setMinutes(new Date(), 45), hour));
  }

  const onSubmit = async (data: any, event?: React.BaseSyntheticEvent) => {
    if (event) {
      event.preventDefault();
    }
    console.log("onSubmit called with data", data);
    const dataToSend: any = {
      idCourt: Number(data.idCourt),
      startHour: data.startHour,
    };
    try {
      const shiftCreationPromise = shitForMatchFn(dataToSend, match.id);
      toast.promise(shiftCreationPromise, {
        loading: "Reservando turno para el partido partido...",
        success: "Turno reservado con éxito!",
        duration: 3000,
      });
      await shiftCreationPromise;
      if (onUpdateMatches) {
        onUpdateMatches();
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
    setIsOpen(false);
  };

  const handleDateChange = (date: Date) => {
    console.log("handleDateChange", date);
    setStartDate(date);
    const dateInUTC = moment(date).utc();
    setValue("startHour", dateInUTC.format());
  };

  const handleCourtSelection = (value: string) => {
    console.log("handleCourtSelection", value);
    setSelectedCourt(value);
    setValue("idCourt", value);
  };

  const toggleDialog = () => {
    console.log("toggleDialog: current state", isOpen);
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => setRenderDatePicker(true), 100);
    } else {
      setRenderDatePicker(false);
    }
  };

  useEffect(() => {
    console.log("useEffect: Modal isOpen", isOpen);
    if (!isOpen) {
      setRenderDatePicker(false);
    } else {
      setTimeout(() => setRenderDatePicker(true), 100);
    }
  }, [isOpen]);

  const handleCourtChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedCourt(value);
    setValue("idCourt", value);
  };

  // Esta parte es para asegurarse de que react-hook-form conoce el valor inicial
  useEffect(() => {
    setValue("idCourt", selectedCourt);
  }, [selectedCourt, setValue]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={toggleDialog} variant="edit" type="button">
            Agregar Turno
          </Button>
        </DialogTrigger>
        <DialogContent className="p-4">
          <DialogHeader>
            <DialogTitle>Seleccionar turno</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 px-4 py-2 w-full sm:w-3/4 md:w-1/2 lg:w-full">
                <Label htmlFor="court">Cancha</Label>
                <select
                  name="idCourt"
                  className="w-full h-10 bg-gray-200 border-gray-300 text-gray-800 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedCourt}
                  onChange={handleCourtChange}
                >
                  <option value="">Seleccione una cancha...</option>
                  <option value="1">Cancha 1</option>
                  <option value="2">Cancha 2</option>
                  <option value="3">Cancha 3</option>
                  <option value="4">Cancha 4</option>
                </select>
                <Label
                  htmlFor="day"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Día
                </Label>
                {renderDatePicker && (
                  <DatePicker
                    showIcon
                    selected={startDate}
                    className="w-full"
                    onChange={handleDateChange}
                    showTimeSelect
                    timeInputLabel="Time:"
                    locale="es"
                    timeIntervals={15}
                    includeTimes={includeTimes}
                    timeCaption="time"
                    customInput={
                      <Input
                        {...register("startHour")}
                        className="bg-gray-200"
                      />
                    }
                    dateFormat="d MMMM h:mm aa"
                  />
                )}
              </div>
            </div>
            <DialogFooter className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto px-4 py-2 text-sm"
                onClick={toggleDialog}
              >
                Cancelar
              </Button>
              <Button
                className="w-full sm:w-auto px-4 py-2 text-sm bg-slate-700"
                type="submit"
              >
                Confirmar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
