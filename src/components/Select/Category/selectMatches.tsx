import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { useCategoriesForTournament } from "@/hooks/Tournament-Category/useTournamentCategory";
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
    // Usar React Query hook
    const { categories: categoriesForTournaments, isLoading: loading } = useCategoriesForTournament({
      idTournament,
      enabled: !!idTournament
    });
  
    // Ya no es necesario useEffect - React Query maneja la carga automáticamente
  
    return (
      <Select value={selected} onValueChange={onCategory}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent>
          {categoriesForTournaments?.map((category) => (
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
  