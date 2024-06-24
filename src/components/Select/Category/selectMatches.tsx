import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { useTournamentCategoryStore } from "@/hooks/useTournamentCategory";
  import { useEffect } from "react";
  
  interface CategorySelectProps {
    selected?: string;
    onCategory?: (value: string) => void;
    idTournament: number;
  }
  
  export const CategoryMatchesSelect = ({
    selected,
    onCategory,
    idTournament,
  }: CategorySelectProps) => {
    const { categoriesForTournaments, getCategoriesForTournament, loading } =
      useTournamentCategoryStore();
  
    useEffect(() => {
      if (idTournament) {
        getCategoriesForTournament(idTournament);
      }
    }, [idTournament, getCategoriesForTournament]);
  
    return (
      <Select value={selected} onValueChange={onCategory}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent>
          {categoriesForTournaments.map((category) => (
            <SelectItem
              key={category.id}
              value={String(category.id)}
            >
              Categoría {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };
  