import React, { useState } from "react";
import { getColumns } from "./columns";
import { DataTable } from "@/components/Table/dataTable";
import { Match } from "@/modules/match/domain/Match";
import EditMatchDialog from "./Time/dialog";
import AddResultMatchDialog from "./AddResult/dialog";
import DeleteMatchDialog from "./Delete/button";

function MatchesIndex({
  match,
  onUpdateMatches,
}: {
  match: any | undefined;
  onUpdateMatches: any;
}) {
  const playersColums = getColumns(onUpdateMatches);

  if (window.innerWidth < 768) {
    return (
      <div className="flex flex-col py-2">
        {match.map((m: Match) => (
          <div
            key={m.id}
            className="p-6 shadow-lg rounded-lg bg-white mb-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {m.finalResult === "pending"
                ? `Pendiente vs ${m.rivalName}`
                : `${m.finalResult} vs ${m.rivalName}`}
            </h3>
            <p className="text-gray-600">Fecha: {m.fixture.jornada}</p>
            <div className="mt-4">
              {m.sets.map((set) => (
                <p key={set.id} className="text-gray-700 font-medium">
                  {set.pointsPlayer1} - {set.pointsPlayer2}
                </p>
              ))}
            </div>
            {m.status === "pending" && (
              <div className="mt-4 flex space-x-2">
                <AddResultMatchDialog
                  match={m}
                  onUpdateMatches={onUpdateMatches}
                />
                <EditMatchDialog match={m} />
                <DeleteMatchDialog match={m} />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col py-2">
        <DataTable
          columns={playersColums}
          data={match}
          showSearch={false}
          canAddUser={false}
        />
      </div>
    </>
  );
}

export default MatchesIndex;
