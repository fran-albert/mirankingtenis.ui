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
    const { categories, getCategoriesForTournament, loading } =
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
          {categories.map((category) => (
            <SelectItem
              key={category.idCategory}
              value={String(category.idCategory)}
            >
              Categoría {category.nameCategory}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };
  