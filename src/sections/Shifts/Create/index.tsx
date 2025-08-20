import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import moment from "moment";

interface ReserveDialogProps {
  open: boolean;
  onClose: () => void;
  selectedSlot: { start: Date; end: Date } | null;
  onReserve: () => void;
  jugadoresDisponibles: { id: number; name: string; lastname: string }[];
  jugadores: number[];
  handleJugadorChange: (index: number, value: number) => void;
  court: string;
  sessionUser: any;
}
export const CreateDoubleMatch: React.FC<ReserveDialogProps> = React.memo(({
  open,
  onClose,
  selectedSlot,
  court,
  onReserve,
  jugadoresDisponibles,
  jugadores,
  handleJugadorChange,
  sessionUser,
}) => {
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>(jugadores);

  useEffect(() => {
    if (!open) {
      setSelectedPlayers([0, 0, 0]);
    }
  }, [open]);

  // Memoizar cálculos costosos
  const formattedDate = useMemo(() => 
    selectedSlot ? moment(selectedSlot.start).format("LL") : "", 
    [selectedSlot]
  );
  
  const formattedTime = useMemo(() => 
    selectedSlot ? moment(selectedSlot.start).format("HH:mm") : "", 
    [selectedSlot]
  );

  // Optimizar el cambio de jugador
  const handlePlayerChange = useCallback((index: number, value: number) => {
    const newPlayers = [...selectedPlayers];
    newPlayers[index] = Number(value);
    setSelectedPlayers(newPlayers);
    handleJugadorChange(index, Number(value));
  }, [selectedPlayers, handleJugadorChange]);

  // Optimizar el submit del modal
  const handleSubmit = useCallback(() => {
    onReserve();
    onClose();
  }, [onReserve, onClose]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Partido Dobles Express</DialogTitle>
          <DialogDescription>
            Selecciona los jugadores para el partido (opcional).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="fecha-hora" className="text-right mb-2 block">
              {formattedDate} - {formattedTime}
            </Label>
            <div>
              <Label htmlFor="court" className="text-right mb-2 block">
                {court}
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jugador-1" className="text-right">
              Jugador 1
            </Label>
            <div className="col-span-3 font-medium">
              {sessionUser.lastname}, {sessionUser.name}
            </div>
          </div>

          {[0, 1, 2].map((index) => (
            <div key={index} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={`jugador-${index + 2}`} className="text-right">
                Jugador {index + 2}
              </Label>
              <Select
                onValueChange={(value) => handlePlayerChange(index, Number(value))}
                value={
                  selectedPlayers[index] ? String(selectedPlayers[index]) : ""
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue
                    placeholder={`Seleccionar jugador ${index + 1}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {jugadoresDisponibles.length > 0 ? (
                    jugadoresDisponibles
                      .filter(
                        (jugador) =>
                          jugador.id === selectedPlayers[index] ||
                          (jugador.id !== sessionUser.id &&
                            !selectedPlayers.includes(jugador.id))
                      )
                      .map((jugador) => (
                        <SelectItem
                          key={jugador.id}
                          value={jugador.id.toString()}
                        >
                          {jugador.lastname}, {jugador.name}
                        </SelectItem>
                      ))
                  ) : (
                    <p>No hay jugadores disponibles</p>
                  )}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
          >
            Crear Partido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

CreateDoubleMatch.displayName = "CreateDoubleMatch";
