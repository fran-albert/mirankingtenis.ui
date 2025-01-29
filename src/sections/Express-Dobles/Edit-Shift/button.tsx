import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { DoublesExhibitionMatchResponse } from "@/types/Double-Match/DoublesExhibitionMatch";
import { useShiftMutation } from "@/hooks/Shift/useShiftMutation";

interface EditMatchDialogProps {
  open: boolean;
  onClose: () => void;
  doubleMatch: DoublesExhibitionMatchResponse;
}

export const EditDoubleMatchDialog: React.FC<EditMatchDialogProps> = ({
  open,
  onClose,
  doubleMatch,
}) => {
  const { handleSubmit, setValue } = useForm();
  const { updateShiftDoubleMatch } = useShiftMutation();
  const [selectedCourt, setSelectedCourt] = useState<string>(
    doubleMatch?.shift?.court?.id?.toString() || "1"
  );
  
  const [newDate, setNewDate] = useState<string>(
    doubleMatch?.shift?.startHour ? doubleMatch.shift.startHour.split(" ")[0] : ""
  );
  
  const [newTime, setNewTime] = useState<string>(
    doubleMatch?.shift?.startHour ? doubleMatch.shift.startHour.split(" ")[1].substring(0, 5) : ""
  );
  
  const handleCourtSelection = (value: string) => {
    if (selectedCourt !== value) {
      setSelectedCourt(value);
      setValue("idCourt", value);
    }
  };

  const onSubmit = async () => {
    const startHour = new Date(`${newDate}T${newTime}:00Z`).toISOString();
    const payload: any = {
      startHour: startHour,
      idCourt: Number(selectedCourt),
    };

    toast.promise(
      updateShiftDoubleMatch.mutateAsync({
        matchId: doubleMatch.id,
        body: payload,
      }),
      {
        loading: "Actualizando turno...",
        success: "Turno actualizado con éxito!",
        error: "Error al actualizar el turno.",
      }
    );

    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[400px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <section className="w-full max-w-md bg-white p-6 flex flex-col space-y-4">
            <h2 className="font-semibold">Editar Turno</h2>
            <div className="mb-20">
              <Label className="mb-2" htmlFor="court">
                Cancha
              </Label>
              <Select
                onValueChange={handleCourtSelection}
                value={selectedCourt}
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
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
              <div>
                <Label className="mb-2" htmlFor="time">
                  Hora
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </div>
            </div>
          </section>
          <DialogFooter className="flex flex-row justify-end gap-4 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
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
};
