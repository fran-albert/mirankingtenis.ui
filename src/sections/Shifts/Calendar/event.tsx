import { BadgeWin } from "@/components/Badge/Green/badge";
import { BadgePending } from "@/components/Badge/Pending/badge";
import moment from "moment-timezone";
import React from "react";

export const CustomEvent = ({ event }: { event: any }) => {
  const startTime = moment(event.start).format("HH:mm");
  const endTime = moment(event.end).format("HH:mm");

  return (
    <div className="flex flex-col justify-between bg-slate-700 text-white text-xs p-2 rounded-lg shadow overflow-hidden">
      <div className="font-bold text-sm">{event.title}</div>
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
    </div>
  );
};
