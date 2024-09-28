import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Controller } from "react-hook-form";
  
  interface GenderSelectProps {
    control: any;
    defaultValue?: string;
    disabled?: boolean;
  }
  export const GenderSelect = ({
    control,
    defaultValue,
    disabled,
  }: GenderSelectProps) => {
    const genderTypes = [
      { id: "male", name: "Masculino" },
      { id: "female", name: "Femenino" },
    ];
  
    return (
      <Controller
        name="gender"
        control={control}
        rules={{ required: "Este campo es obligatorio" }}
        defaultValue={defaultValue || ""}
        render={({ field }) => (
          <div>
            <Select
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione el género.." />
              </SelectTrigger>
              <SelectContent>
                {genderTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      />
    );
  };