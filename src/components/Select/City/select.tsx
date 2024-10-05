import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCity } from "@/hooks/City/useCity";
import { City } from "@/types/City/City";
import { Controller } from "react-hook-form";

interface CitySelectProps {
  control: any;
  idState: number;
  defaultValue?: City;
  onCityChange?: (value: City) => void;
  disabled?: boolean;
}

export const CitySelect = ({
  control,
  idState,
  defaultValue,
  onCityChange,
  disabled,
}: CitySelectProps) => {
  const { cities, isLoading } = useCity({ idState });

  const handleValueChange = (cityId: string) => {
    const city = cities.find((c) => String(c.id) === cityId);
    if (city) {
      onCityChange && onCityChange(city);
    }
  };

  return (
    <Controller
      name="idCity"
      control={control}
      defaultValue={defaultValue ? String(defaultValue.id) : ""}
      render={({ field }) => {
        const selectedCity = cities.find(
          (city) => String(city.id) === String(field.value)
        );

        return (
          <div>
            <Select
              value={selectedCity ? String(selectedCity.id) : ""}
              onValueChange={(value) => {
                field.onChange(value);
                handleValueChange(value);
              }}
              disabled={disabled || isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione la localidad...">
                  {selectedCity ? selectedCity.city : "Seleccione la localidad..."}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={String(city.id)} value={String(city.id)}>
                    {city.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      }}
    />
  );
};
