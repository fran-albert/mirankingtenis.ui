"use client";
import { MatchesTable } from "@/sections/Matches/Table/table";
import React from "react";
import { TennisScoreboard } from "./tennisScoreBoard";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

// Datos de ejemplo para el componente
const matchData = [
  {
    name: "Elina Svitolina",
    seed: 15,
    flagColor: "blue",
    scores: [1, 4],
  },
  {
    name: "Iga Swiatek",
    seed: 1,
    flagColor: "red",
    scores: [6, 6],
  },
  {
    name: "Elina Svitolina",
    seed: 15,
    flagColor: "blue",
    scores: [1, 4],
  },
  {
    name: "Iga Swiatek",
    seed: 1,
    flagColor: "red",
    scores: [6, 6],
  },
  {
    name: "Elina Svitolina",
    seed: 15,
    flagColor: "blue",
    scores: [1, 4],
  },
  {
    name: "Iga Swiatek",
    seed: 1,
    flagColor: "red",
    scores: [6, 6],
  },
  {
    name: "Elina Svitolina",
    seed: 15,
    flagColor: "blue",
    scores: [1, 4],
  },
  {
    name: "Iga Swiatek",
    seed: 1,
    flagColor: "red",
    scores: [6, 6],
  },
];

function MatchesPage() {
  return (
    <>
      <div className="flex items-center justify-center py-2 px-4 bg-white rounded-lg shadow">
        <button className="mr-2">
          <FaArrowLeft className="h-6 w-6 text-gray-800" />
        </button>

        <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
          <span className="whitespace-nowrap py-1 px-4 bg-slate-500 text-white rounded-full">
            Fecha 1
          </span>
          <span className="whitespace-nowrap py-1 px-4">Fecha 2</span>
          <span className="whitespace-nowrap py-1 px-4">Fecha 3</span>
          <span className="whitespace-nowrap py-1 px-4">Fecha 4</span>
        </div>

        <button className="ml-2">
          <FaArrowRight className="h-6 w-6 text-gray-800" />
        </button>
      </div>
      <div className="flex justify-center w-full lg:px-0 m-2">
        <div className="w-full">
          <TennisScoreboard matches={matchData} />
        </div>
      </div>
    </>
  );
}

export default MatchesPage;
