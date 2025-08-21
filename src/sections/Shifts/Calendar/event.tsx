import { BadgeWin } from "@/components/Badge/Green/badge";
import { BadgePending } from "@/components/Badge/Pending/badge";
import moment from "moment-timezone";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MdDelete } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "./style.css";

interface CustomEventProps {
  event: any;
  sessionUser?: {
    id: number;
    role?: string;
  };
  onDeleteShift?: (shiftId: number) => void;
}

export const CustomEvent = ({ event, sessionUser, onDeleteShift }: CustomEventProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const startTime = moment(event.start).format("HH:mm");
  const endTime = moment(event.end).format("HH:mm");

  // Verificar si el usuario puede eliminar el turno
  const canDeleteShift = () => {
    if (!sessionUser || !event.shift?.id) return false;
    
    // No se puede eliminar si el partido ya está finalizado
    if (event.status === 'played') return false;
    
    // Admin puede eliminar cualquier turno
    if (sessionUser.role === 'admin') return true;
    
    // El jugador puede eliminar su propio turno
    // Verificar si el usuario es uno de los jugadores del partido
    return event.player1Id === sessionUser.id || event.player2Id === sessionUser.id;
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se propague el click al evento
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (onDeleteShift && event.shift?.id) {
      onDeleteShift(event.shift.id);
    }
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="bg-slate-700 text-white text-xs p-1 sm:text-sm sm:p-2 rounded-lg shadow h-full relative group">
      <div className="font-bold">{event.title}</div>
      <div className="opacity-80">{`${startTime} - ${endTime}`}</div>
      
      {event.status === "pending" && (
        <div className="mt-1">
          <BadgePending text="Pendiente" />
        </div>
      )}
      {event.status === "played" && (
        <div className="mt-1">
          <BadgeWin text="Finalizado" />
        </div>
      )}

      {/* Botón de eliminar - solo visible para usuarios autorizados */}
      {canDeleteShift() && (
        <Button
          onClick={handleDeleteClick}
          variant="destructive"
          size="sm"
          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Eliminar turno"
        >
          <MdDelete className="h-3 w-3" />
        </Button>
      )}

      {/* Modal de confirmación para eliminar turno */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Eliminar Turno</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este turno?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium text-gray-900">{event.title}</div>
              <div className="text-sm text-gray-600">
                {moment(event.start).format("dddd, DD [de] MMMM [de] YYYY")}
              </div>
              <div className="text-sm text-gray-600">
                {startTime} - {endTime}
              </div>
              {event.shift?.court && (
                <div className="text-sm text-gray-600">
                  Cancha: {event.shift.court.name || event.shift.court}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar Turno
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
