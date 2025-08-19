import React, { useState } from "react";
import { getColumns } from "./columns";
import { DataTable } from "@/components/Table/dataTable";
import AddShiftDialog from "./Time/dialog";
import AddResultMatchDialog from "./AddResult/dialog";
import DeleteMatchDialog from "./Delete/button";
import { formatDate, formatDateComplete } from "@/lib/utils";
import { Match } from "@/types/Match/Match";
import UpdateShiftDialog from "./EditTime/dialog";
import DeleteShiftDialog from "./DeleteShift/dialog";

function MatchesIndex({
  match,
  onUpdateMatches,
}: {
  match: any | undefined;
  onUpdateMatches: any;
}) {
  const playersColums = getColumns(onUpdateMatches);
  console.log(match);
  if (window.innerWidth < 768) {
    return (
      <div className="flex flex-col py-2">
        {match.map((m: Match) => (
          <div
            key={m.id}
            className="p-6 shadow-lg rounded-2xl bg-white mb-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 ease-in-out"
          >
            <h3
              className={`text-xl font-semibold mb-2 ${
                m.finalResult === "pending"
                  ? " inline-flex text-sm font-bold rounded-full text-gray-900"
                  : " inline-flex text-sm font-bold rounded-full text-gray-800"
              }`}
            >
              {m.isBye
                ? `Fecha Libre`
                : m.finalResult === "pending"
                ? `Pendiente vs ${m.rivalName}`
                : `${m.finalResult} vs ${m.rivalName}`}
            </h3>
            <p className="text-gray-600">
              {m.fixture
                ? `Fecha: ${m.fixture.jornada}`
                : `${
                    m.playoff.roundType === "QuarterFinals"
                      ? "Cuartos de Final"
                      : m.playoff.roundType === "SemiFinals"
                      ? "Semifinal"
                      : m.playoff.roundType === "Final"
                      ? "Final"
                      : m.playoff.roundType
                  }`}
            </p>

            {!m.isBye && (
              <>
                <p className="text-gray-600">
                  Cancha: {m.shift?.court ? String(m.shift.court) : ""}
                </p>
                <p className="text-gray-600">
                  Día y Hora:{" "}
                  {m.shift?.startHour && formatDateComplete(m.shift?.startHour)}
                </p>
                <div className="mt-4">
                  {m.sets.map((set) => (
                    <span
                      key={set.id}
                      className="inline-flex items-center justify-center px-3 py-1 mr-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full"
                    >
                      {set.pointsPlayer1} - {set.pointsPlayer2}
                    </span>
                  ))}
                </div>
              </>
            )}

            {m.status !== "played" && !m.isBye && (
              <>
                {m.shift === null || m.shift?.startHour === null ? (
                  <AddShiftDialog match={m} onUpdateMatches={onUpdateMatches} />
                ) : (
                  <>
                    <AddResultMatchDialog
                      match={m}
                      onUpdateMatches={onUpdateMatches}
                    />
                    <UpdateShiftDialog
                      match={m}
                      onUpdateMatches={onUpdateMatches}
                    />
                    <DeleteShiftDialog
                      idShift={Number(m.shift.id)}
                      onUpdateMatches={onUpdateMatches}
                    />
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col py-2">
      <DataTable
        columns={playersColums}
        data={match}
        showSearch={false}
        canAddUser={false}
      />
    </div>
  );
}

export default MatchesIndex;
