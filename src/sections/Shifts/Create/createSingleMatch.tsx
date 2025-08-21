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

import { MatchByUserResponseDto } from "@/types/Match/MatchByUser.dto";

interface PendingMatch extends MatchByUserResponseDto {}

interface CreateSingleMatchProps {
  open: boolean;
  onClose: () => void;
  selectedSlot: { start: Date; end: Date } | null;
  onReserve: (matchId: number) => void;
  pendingMatches: PendingMatch[];
  court: string;
  sessionUser: any;
}

export const CreateSingleMatch: React.FC<CreateSingleMatchProps> = React.memo(({
  open,
  onClose,
  selectedSlot,
  court,
  onReserve,
  pendingMatches,
  sessionUser,
}) => {
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  useEffect(() => {
    if (!open) {
      setSelectedMatchId(null);
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

  // Optimizar el cambio de partido
  const handleMatchChange = useCallback((value: string) => {
    setSelectedMatchId(Number(value));
  }, []);

  // Optimizar el submit del modal
  const handleSubmit = useCallback(() => {
    if (!selectedMatchId) {
      alert("Por favor selecciona un partido");
      return;
    }
    onReserve(selectedMatchId);
    onClose();
  }, [onReserve, onClose, selectedMatchId]);

  const handleCancel = useCallback(() => {
    setSelectedMatchId(null);
    onClose();
  }, [onClose]);

  // Obtener el rival del partido seleccionado
  const getRivalName = useCallback((match: PendingMatch) => {
    const rival = match.user1.id === sessionUser.id ? match.user2 : match.user1;
    if (!rival) return "Sin rival asignado";
    return `${rival.lastname}, ${rival.name}`;
  }, [sessionUser.id]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-center">
            Asignar Turno a Partido
          </DialogTitle>
          <DialogDescription className="text-sm text-center px-2">
            Selecciona uno de tus partidos pendientes para asignarle un turno.
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

          {/* Selector de partido */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Partido Pendiente *</Label>
            <Select
              onValueChange={handleMatchChange}
              value={selectedMatchId ? String(selectedMatchId) : ""}
            >
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Elegir partido pendiente" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {pendingMatches.length > 0 ? (
                  pendingMatches
                    .filter(match => !match.shift?.startHour) // Solo partidos sin turno asignado
                    .map((match) => (
                      <SelectItem
                        key={match.id}
                        value={match.id.toString()}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">vs {getRivalName(match)}</span>
                          <span className="text-xs text-gray-500">
                            {match.fixture ? `Jornada ${match.fixture.jornada}` : 'Partido especial'}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem value="no-matches" disabled>
                    No tienes partidos pendientes
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
            disabled={!selectedMatchId}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            Asignar Turno
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

CreateSingleMatch.displayName = "CreateSingleMatch";