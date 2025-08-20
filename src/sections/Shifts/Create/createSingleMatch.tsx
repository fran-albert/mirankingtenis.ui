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

interface CreateSingleMatchProps {
  open: boolean;
  onClose: () => void;
  selectedSlot: { start: Date; end: Date } | null;
  onReserve: (rivalId: number | null) => void;
  availableRivals: { id: number; name: string; lastname: string }[];
  court: string;
  sessionUser: any;
}

export const CreateSingleMatch: React.FC<CreateSingleMatchProps> = React.memo(({
  open,
  onClose,
  selectedSlot,
  court,
  onReserve,
  availableRivals,
  sessionUser,
}) => {
  const [selectedRival, setSelectedRival] = useState<number | null>(null);

  useEffect(() => {
    if (!open) {
      setSelectedRival(null);
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

  // Optimizar el cambio de rival
  const handleRivalChange = useCallback((value: string) => {
    setSelectedRival(Number(value));
  }, []);

  // Optimizar el submit del modal
  const handleSubmit = useCallback(() => {
    if (!selectedRival) {
      alert("Por favor selecciona un rival");
      return;
    }
    onReserve(selectedRival);
    onClose();
  }, [onReserve, onClose, selectedRival]);

  const handleCancel = useCallback(() => {
    setSelectedRival(null);
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-center">
            Crear Partido Individual
          </DialogTitle>
          <DialogDescription className="text-sm text-center px-2">
            Selecciona uno de tus rivales programados para crear un turno.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 px-2">
          {/* Información de fecha y cancha */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <div className="text-center">
              <Label className="text-sm font-medium text-gray-600">
                📅 {formattedDate}
              </Label>
            </div>
            <div className="text-center">
              <Label className="text-sm font-medium text-gray-600">
                🕐 {formattedTime}
              </Label>
            </div>
            <div className="text-center">
              <Label className="text-sm font-medium text-gray-600">
                🎾 {court}
              </Label>
            </div>
          </div>

          {/* Jugador 1 (usuario actual) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Jugador 1</Label>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-medium text-blue-800">
                {sessionUser.lastname}, {sessionUser.name}
              </div>
              <div className="text-xs text-blue-600">Tú</div>
            </div>
          </div>

          {/* Selector de rival */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Rival *</Label>
            <Select
              onValueChange={handleRivalChange}
              value={selectedRival ? String(selectedRival) : ""}
            >
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Elegir rival de mis partidos" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {availableRivals.length > 0 ? (
                  availableRivals
                    .filter(rival => rival.id !== sessionUser.id)
                    .map((rival) => (
                      <SelectItem
                        key={rival.id}
                        value={rival.id.toString()}
                      >
                        <div className="flex flex-col">
                          <span>{rival.lastname}, {rival.name}</span>
                        </div>
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem value="no-players" disabled>
                    No tienes rivales programados
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 px-2 pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!selectedRival}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            Crear Partido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

CreateSingleMatch.displayName = "CreateSingleMatch";