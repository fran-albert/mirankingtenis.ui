"use client";
import { StepsControllerV2 } from "@/sections/Fixture/stepControllerV2";
import React from "react";
import { useParams } from "next/navigation";
function NewMatchDay() {
  const params = useParams<{
    id: string;
    idCategory: string;
    nextMatchDay: string;
  }>();

  const idTournament = Number(params.id);
  const idCategory = Number(params.idCategory);
  const nextMatchDay = Number(params.nextMatchDay);

  return (
    <div>
      <StepsControllerV2
        idTournament={idTournament}
        idCategory={idCategory}
        nextMatchDay={nextMatchDay}
      />
    </div>
  );
}

export default NewMatchDay;
