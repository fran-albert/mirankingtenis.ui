import React, { useCallback, useEffect, useState, useMemo } from "react";
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
import { CreateDoubleMatch } from "../Create";
import { CreateSingleMatch } from "../Create/createSingleMatch";
import { User } from "@/types/User/User";
import useRoles from "@/hooks/useRoles";
import { useDoubleMatchMutations } from "@/hooks/Doubles-Express/useDoubleMatchMutation";
import { toast } from "sonner";
import { DoublesExhibitionMatchResponse } from "@/types/Double-Match/DoublesExhibitionMatch";
import { useMatchesByUser } from "@/hooks/Matches/useMatches";
import {
  useCurrentTournamentByPlayer,
  useLastTournamentByPlayer,
} from "@/hooks/Tournament/useTournament";
import { useTournamentCategoriesByUser } from "@/hooks/Tournament-Category/useTournamentCategory";
import { createSingleMatch } from "@/api/Shift/create-single-match";
import { MatchByUserResponseDto } from "@/types/Match/MatchByUser.dto";

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
  const [selectedRival, setSelectedRival] = useState<number | null>(null);
  const [showSingleMatchDialog, setShowSingleMatchDialog] = useState(false);
  const { addDoublesMatchesMutation } = useDoubleMatchMutations();

  const idUser = session?.user?.id ? Number(session.user.id) : 0;

  // Obtener el torneo actual o último del usuario
  const { tournament: currentTournament } = useCurrentTournamentByPlayer({
    idPlayer: idUser,
    enabled: !!idUser,
  });

  const { tournament: lastTournament } = useLastTournamentByPlayer({
    idPlayer: idUser,
    enabled: !!idUser,
  });

  // Usar torneo actual o último como fallback
  const activeTournament = currentTournament || lastTournament;

  // Obtener las categorías del usuario en ese torneo
  const { categoriesForTournaments } = useTournamentCategoriesByUser({
    idUser: idUser,
    enabled: !!idUser && !!activeTournament,
  });

  // Obtener la primera categoría disponible
  const firstCategory = activeTournament
    ? categoriesForTournaments.find(
        (tc) => tc.tournament.id === activeTournament.id
      )
    : undefined;

  // Obtener los partidos del usuario en el torneo y categoría actuales
  const { data: userMatches = [] } = useMatchesByUser(
    idUser,
    activeTournament?.id || 0,
    firstCategory?.category.id || 0,
    !!idUser && !!activeTournament && !!firstCategory
  );

  // Extraer rivales únicos de los partidos del usuario
  const availableRivals = useMemo(() => {
    if (!userMatches.length || !session?.user?.id) return [];

    const currentUserId = Number(session.user.id);
    const rivals = new Map();

    userMatches.forEach((match: MatchByUserResponseDto) => {
      // Agregar user1 si no es el usuario actual
      if (match.user1 && match.user1.id !== currentUserId) {
        rivals.set(match.user1.id, {
          id: match.user1.id,
          name: match.user1.name,
          lastname: match.user1.lastname,
        });
      }

      // Agregar user2 si existe y no es el usuario actual
      if (match.user2 && match.user2.id !== currentUserId) {
        rivals.set(match.user2.id, {
          id: match.user2.id,
          name: match.user2.name,
          lastname: match.user2.lastname,
        });
      }
    });

    return Array.from(rivals.values());
  }, [userMatches, session?.user?.id]);
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

  const resourceMap = useMemo(
    () => [
      { resourceId: 1, resourceTitle: "Cancha 1" },
      { resourceId: 2, resourceTitle: "Cancha 2" },
      { resourceId: 3, resourceTitle: "Cancha 3" },
      { resourceId: 4, resourceTitle: "Cancha 4" },
    ],
    []
  );

  const minTime = new Date();
  minTime.setHours(9, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(22, 0, 0);

  // Función que se ejecuta al hacer clic en un slot vacío del calendario
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null);

  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      if (!session) {
        return;
      }

      // Optimización: calcular todo de una vez
      const selectedStart = moment(slotInfo.start).startOf("hour");
      const selectedEnd = moment(selectedStart).add(2, "hours");
      const selectedCourtTitle =
        resourceMap.find((court) => court.resourceId === slotInfo.resourceId)
          ?.resourceTitle || "Cancha desconocida";

      // Batch de state updates para evitar re-renders múltiples
      setSelectedSlot({
        start: selectedStart.toDate(),
        end: selectedEnd.toDate(),
      });
      setSelectedCourt(selectedCourtTitle);
      // Cambiar a modal de partido individual
      setShowSingleMatchDialog(true);
    },
    [session, resourceMap]
  );

  const handleReserve = () => {
    if (!session || !selectedSlot) return;

    const formattedData = {
      createdBy: Number(session.user.id),
      player1Id: Number(session.user.id),
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

  // Nueva función para reservar partido individual
  const handleSingleMatchReserve = async (rivalId: number | null) => {
    if (!session || !selectedSlot) return;

    const singleMatchData = {
      createdBy: Number(session.user.id),
      player1Id: Number(session.user.id),
      player2Id: rivalId,
      startHour: moment(selectedSlot.start).toISOString(),
      idCourt:
        resourceMap.find((court) => court.resourceTitle === selectedCourt)
          ?.resourceId || 0,
    };

    try {
      await toast.promise(createSingleMatch(singleMatchData), {
        loading: "Creando partido individual...",
        success: "Partido creado con éxito!",
        error: (err) => {
          console.error("Error al crear el partido:", err);
          return err.response?.data?.message || "Ocurrió un error inesperado.";
        },
      });
      setShowSingleMatchDialog(false);
      // Aquí podrías actualizar la lista de partidos si tienes un callback
    } catch (error) {
      console.error("Error al crear partido individual:", error);
    }
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
      <CreateSingleMatch
        open={showSingleMatchDialog}
        onClose={() => setShowSingleMatchDialog(false)}
        selectedSlot={selectedSlot}
        onReserve={handleSingleMatchReserve}
        availableRivals={availableRivals}
        sessionUser={{
          id: session?.user?.id || 0,
          name: session?.user?.name || "Desconocido",
          lastname: session?.user?.lastname || "",
        }}
        court={String(selectedCourt)}
      />
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
