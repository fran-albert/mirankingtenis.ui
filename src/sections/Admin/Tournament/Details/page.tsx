import React, { useEffect, useState } from "react";
import { Tournament } from "@/modules/tournament/domain/Tournament";
import { TournamentCategory } from "@/modules/tournament-category/domain/TournamentCategory";
import MasterTournamentDetail from "../Master";
import LeagueTournamentDetail from "../League";
function DetailsTournament({
  tournament,
  categories: initialCategories,
  categoryDates,
}: {
  tournament: Tournament | null;
  categories: TournamentCategory[];
  categoryDates: any;
}) {
  return (
    <div>
      {tournament?.type === "master" && (
        <MasterTournamentDetail
          categories={initialCategories}
          tournament={tournament}
        />
      )}
      {tournament?.type === "league" && (
        <LeagueTournamentDetail
          categories={initialCategories}
          tournament={tournament}
          categoryDates={categoryDates}
        />
      )}
    </div>
  );
}

export default DetailsTournament;
