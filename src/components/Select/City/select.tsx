import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { City } from "@/modules/city/domain/City";
import { CityRepository } from "@/modules/city/domain/CityRepository";
import { createApiCityRepository } from "@/modules/city/infra/ApiCityRepository";
import { useEffect, useState } from "react";

interface CitySelectProps {
  selected?: string;
  onCityChange?: (value: string) => void;
  idState?: string;
}

export const CitySelect = ({
  selected,
  onCityChange,
  idState,
}: CitySelectProps) => {
  const [cities, setCities] = useState<City[]>([]);
  const cityRepository: CityRepository = createApiCityRepository();

  useEffect(() => {
    if (idState) {
      const loadCities = async () => {
        try {
          const loadedCities = await cityRepository.getAllByState(
            parseInt(idState, 10)
          );
          setCities(loadedCities || []);
        } catch (error) {
          console.error("Error al obtener las localidades:", error);
        }
      };

      loadCities();
    } else {
      setCities([]);
    }
  }, [idState]);

  const handleChange = (value: string) => {
    const selectedCity = cities.find((city) => String(city.id) === value);
    if (onCityChange && selectedCity) {
      onCityChange(selectedCity.id.toString());
    }
  };

  return (
    <Select value={selected} onValueChange={handleChange}>
      <SelectTrigger className="w-full bg-gray-200 border-gray-300 text-gray-800">
        <SelectValue placeholder="Seleccione la localidad..." />
      </SelectTrigger>
      <SelectContent>
        {cities.map((city) => (
          <SelectItem key={city.id} value={String(city.id)}>
            {city.city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
