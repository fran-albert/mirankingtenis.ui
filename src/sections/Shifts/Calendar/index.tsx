import React, { useCallback, useEffect, useState } from "react";
import {
  Calendar,
  SlotInfo,
  View,
  Views,
  momentLocalizer,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/es";
import "../Calendar/style.css";
import { CustomEvent } from "./event";
import { Button } from "@/components/ui/button";
import { ShiftTable } from "../Table/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CreateDoubleMatch } from "../Create";
import { User } from "@/types/User/User";
import useRoles from "@/hooks/useRoles";
import { useDoubleMatchMutations } from "@/hooks/Doubles-Express/useDoubleMatchMutation";
import { toast } from "sonner";
import { DoublesExhibitionMatchResponse } from "@/types/Double-Match/DoublesExhibitionMatch";

moment.locale("es");
interface MatchEvent {
  title: string;
  start: Date;
  end: Date;
  status: string;
  allDay: boolean;
  shift: {
    court: {
      id: number;
    };
  };
}

const localizer = momentLocalizer(moment);
export const ShiftCalendar = ({
  matches,
  players,
  doublesMatches,
}: {
  matches: any;
  players: User[];
  doublesMatches: DoublesExhibitionMatchResponse[];
}) => {
  const { session } = useRoles();
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [view, setView] = useState<View | undefined>(Views.DAY);
  const availableViews = [Views.DAY];
  const onView = useCallback((newView: View) => {
    setView(newView);
  }, []);
  const [showCalendar, setShowCalendar] = useState(true);
  const [date, setDate] = useState(new Date());

  const onNavigate = useCallback(
    (newDate: Date) => setDate(newDate),
    [setDate]
  );
  const [showDialog, setShowDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [jugadoresSeleccionados, setJugadoresSeleccionados] = useState<
    number[]
  >([]);
  const { addDoublesMatchesMutation } = useDoubleMatchMutations();
   const handleJugadorChange = (index: number, value: number) => {
    setJugadoresSeleccionados((prev) => {
      const newJugadores = [...prev];
      newJugadores[index - 1] = value;
      return newJugadores;
    });
  };

  const toggleView = () => setShowCalendar(!showCalendar);
  useEffect(() => {
    const sortEvents = (events: MatchEvent[]): MatchEvent[] => {
      if (view === Views.DAY) {
        events.sort((a, b) => a.start.getTime() - b.start.getTime());
        return events.sort((a, b) => a.shift?.court?.id - b.shift?.court?.id);
      }
      return events;
    };

    // 📌 Mapear `matches` (partidos 1vs1)
    let myEventsList: MatchEvent[] = matches.map((match: any) => ({
      title: `${match.user1.lastname} vs ${match.user2?.lastname || "???"}`,
      start: new Date(match.shift?.startHour),
      end: new Date(match.shift?.endHour),
      allDay: false,
      status: match.status,
      shift: match.shift,
      resourceId: match.shift?.court?.id,
    }));

    // 📌 Mapear `doublesMatches` (partidos dobles)
    const formatPlayerName = (player?: User | null) => {
      return player ? `${player.lastname}` : "???";
    };

    const doublesEvents = doublesMatches.map((match) => ({
      title: `${formatPlayerName(match.player1)} & ${formatPlayerName(
        match.player3
      )} vs ${formatPlayerName(match.player2)} & ${formatPlayerName(
        match.player4
      )}`,
      start: new Date(match.shift?.startHour),
      end: new Date(match.shift?.endHour),
      allDay: false,
      status: "Doubles",
      shift: match.shift,
      resourceId: match.shift?.court?.id,
    }));

    // 📌 Unir partidos individuales y dobles
    myEventsList = [...myEventsList, ...doublesEvents];

    // 📌 Ordenar eventos
    myEventsList = sortEvents(myEventsList);

    setEvents(myEventsList);
  }, [matches, doublesMatches, view]);

  const messages = {
    next: "Siguiente",
    previous: "Anterior",
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
    date: "Fecha",
    time: "Hora",
    event: "Partido",
  };

  const resourceMap = [
    { resourceId: 1, resourceTitle: "Cancha 1" },
    { resourceId: 2, resourceTitle: "Cancha 2" },
    { resourceId: 3, resourceTitle: "Cancha 3" },
    { resourceId: 4, resourceTitle: "Cancha 4" },
  ];

  const minTime = new Date();
  minTime.setHours(9, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(22, 0, 0);

  // Función que se ejecuta al hacer clic en un slot vacío del calendario
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null);

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    if (!session) {
      return;
    }
    const selectedStart = moment(slotInfo.start).startOf("hour");
    const selectedEnd = moment(selectedStart).add(2, "hours");

    setSelectedSlot({
      start: selectedStart.toDate(),
      end: selectedEnd.toDate(),
    });

    // Guardar la cancha seleccionada usando el resourceId
    const selectedCourt = resourceMap.find(
      (court) => court.resourceId === slotInfo.resourceId
    )?.resourceTitle;

    setSelectedCourt(selectedCourt || "Cancha desconocida");

    setShowDialog(true);
  };

  const handleReserve = () => {
    if (!session || !selectedSlot) return;

    const formattedData = {
      createdBy: session.user.id,
      player1Id: session.user.id,
      player2Id: jugadoresSeleccionados[0] || null,
      player3Id: jugadoresSeleccionados[1] || null,
      player4Id: jugadoresSeleccionados[2] || null,
      startHour: moment(selectedSlot.start).toISOString(),
      idCourt:
        resourceMap.find((court) => court.resourceTitle === selectedCourt)
          ?.resourceId || 0,
    };

    toast.promise(addDoublesMatchesMutation.mutateAsync(formattedData), {
      loading: "Creando partido...",
      success: "Partido creado con éxito!",
      error: (err) => {
        console.error("Error al crear el partido:", err);
        return err.response?.data?.message || "Ocurrió un error inesperado.";
      },
    });
    setShowDialog(false);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="w-full px-2 max-h-[90vh]">
        <div className="w-full flex justify-center my-4">
          <Button
            onClick={toggleView}
            className="bg-primary text-white py-2 px-4 rounded-md shadow"
          >
            {showCalendar ? "Listado de Turnos" : "Calendario"}
          </Button>
        </div>
        <h1 className="text-2xl text-center font-medium my-2">
          {showCalendar ? "Calendario" : "Listado de Turnos"}
        </h1>
        <div className="responsive-calendar-container">
          {showCalendar ? (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              date={date}
              messages={messages}
              onView={onView}
              views={availableViews}
              selectable={!!session}
              view={view}
              resources={resourceMap}
              onSelectSlot={handleSelectSlot}
              resourceIdAccessor="resourceId"
              resourceTitleAccessor="resourceTitle"
              min={minTime}
              max={maxTime}
              onNavigate={onNavigate}
              components={{
                event: CustomEvent,
              }}
            />
          ) : (
            <ShiftTable />
          )}
        </div>
      </div>
      <CreateDoubleMatch
        open={showDialog}
        onClose={() => setShowDialog(false)}
        selectedSlot={selectedSlot}
        onReserve={handleReserve}
        jugadoresDisponibles={players}
        jugadores={jugadoresSeleccionados}
        sessionUser={
          session
            ? {
                id: session.user.id,
                name: session.user.name || "Desconocido",
                lastname: session.user.lastname || "",
              }
            : { id: 0, name: "Desconocido", lastname: "" }
        }
        court={String(selectedCourt)}
        handleJugadorChange={handleJugadorChange}
      />
    </div>
  );
};
