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

interface FilterMatchesProps {
  onSelectTournament: (value: string) => void;
  onSelectCategory: (value: string) => void;
  onSelectJornada: (value: string) => void;
  selectedTournament: string;
  selectedCategory: string;
  selectedJornada: string;
  jornadas: number[];
}

function FiltersMatches({
  onSelectTournament,
  onSelectCategory,
  onSelectJornada,
  selectedTournament,
  selectedCategory,
  selectedJornada,
  jornadas,
}: FilterMatchesProps) {
  return (
    <>
      <div className="container mx-auto my-8">
        <div className="bg-background p-6 rounded-lg shadow">
          <div className="grid grid-cols-3 gap-4">
            <TournamentLeagueSelect
              selected={selectedTournament}
              onTournament={onSelectTournament}
            />
            <CategoryMatchesSelect
              idTournament={Number(selectedTournament)}
              selected={selectedCategory}
              onCategory={onSelectCategory}
            />
            <Select value={selectedJornada} onValueChange={onSelectJornada}>
              <SelectTrigger>
                <SelectValue placeholder="Fecha" />
              </SelectTrigger>
              <SelectContent>
                {jornadas.map((jornada) => (
                  <SelectItem key={jornada} value={String(jornada)}>
                    Fecha {jornada}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
}

export default FiltersMatches;
