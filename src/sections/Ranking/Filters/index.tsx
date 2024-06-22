import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TournamentLeagueSelect } from "@/components/Select/Tournament/select";
import { CategoryMatchesSelect } from "@/components/Select/Category/selectMatches";

interface FilterRankingProps {
  onSelectTournament: (value: string) => void;
  onSelectCategory: (value: string) => void;
  selectedTournament: string;
  selectedCategory: string;
}

function FiltersRanking({
  onSelectTournament,
  onSelectCategory,
  selectedTournament,
  selectedCategory,
}: FilterRankingProps) {
  return (
    <>
      <div className="container mx-auto my-8">
        <div className="bg-background p-6 rounded-lg shadow">
          <div className="grid grid-cols-2 gap-4">
            <TournamentLeagueSelect
              selected={selectedTournament}
              onTournament={onSelectTournament}
            />
            <CategoryMatchesSelect
              idTournament={Number(selectedTournament)}
              selected={selectedCategory}
              onCategory={onSelectCategory}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default FiltersRanking;
