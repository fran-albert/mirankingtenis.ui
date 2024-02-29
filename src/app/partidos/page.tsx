"use client";
import React, { useState } from "react";
import { TennisScoreboard } from "../../sections/Matches/TennisScoreBoard/tennisScoreBoard";
import FixtureTabs from "@/sections/Matches/FixtureTabs/tabs";

function MatchesPage() {
  const [selectedJornada, setSelectedJornada] = useState(1);
  return (
    <>
      <FixtureTabs onSelectJornada={(jornada) => setSelectedJornada(jornada)} />
      <div className="flex justify-center w-full lg:px-0 m-2">
        <div className="w-full">
          <TennisScoreboard jornada={selectedJornada} />
        </div>
      </div>
    </>
  );
}

export default MatchesPage;
