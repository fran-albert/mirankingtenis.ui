import React, { useCallback, useEffect, useState } from "react";
import { Calendar, View, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/es";
import "../Calendar/style.css";
import { CustomEvent } from "./event";
import { Button } from "@/components/ui/button";
import { ShiftTable } from "../Table/table";
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
export const ShiftCalendar = ({ matches }: { matches: any }) => {
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
  const toggleView = () => setShowCalendar(!showCalendar);
  console.log(matches);
  useEffect(() => {
    const sortEvents = (events: MatchEvent[]): MatchEvent[] => {
      if (view === Views.DAY) {
        events.sort((a, b) => a.start.getTime() - b.start.getTime());
        return events.sort((a, b) => a.shift.court.id - b.shift.court.id);
      }
      return events;
    };

    let myEventsList: MatchEvent[] = matches.map((match: any) => ({
      title: `${match.user1.lastname} vs ${match.user2.lastname}`,
      start: new Date(match.shift.startHour),
      end: new Date(match.shift.endHour),
      allDay: false,
      status: match.status,
      shift: match.shift,
      resourceId: match.shift.court.id,
    }));

    myEventsList = sortEvents(myEventsList);

    setEvents(myEventsList);
  }, [matches, view]);

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
              view={view}
              resources={resourceMap}
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
    </div>
  );
};
