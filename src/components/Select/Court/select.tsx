import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/modules/category/domain/Category";
import { CategoryRepository } from "@/modules/category/domain/CategoryRepository";
import { createApiCategoryRepository } from "@/modules/category/infra/ApiCategoryRepository";
import { Court } from "@/modules/court/domain/Court";
import { createApiCourtRepository } from "@/modules/court/infra/ApiCourtRepository";
import { useEffect, useState } from "react";

interface CourtSelectProps {
  selected?: string;
  onCourt?: (value: string) => void;
  className?: string;
}

export const CourtSelect = ({
  selected,
  onCourt,
  className,
}: CourtSelectProps) => {
  const [court, setCourt] = useState<Court[]>([]);
  const courtRepository = createApiCourtRepository();

  useEffect(() => {
    const loadCourt = async () => {
      try {
        const court = await courtRepository.getAll();
        setCourt(court);
      } catch (error) {
        console.error("Error al obtener los estados:", error);
      }
    };

    loadCourt();
  }, [courtRepository]);

  return (
    <Select value={selected} onValueChange={onCourt}>
      <SelectTrigger
        className={`w-full ${
          className ? className : "bg-gray-200 border-gray-300 text-gray-800"
        }`}
      >
        <SelectValue placeholder="Seleccione la cancha..." />
      </SelectTrigger>
      <SelectContent>
        {court.map((court) => (
          <SelectItem key={court.id} value={String(court.id)}>
            Cancha {court.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
