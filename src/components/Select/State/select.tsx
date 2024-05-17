import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from "@/modules/state/domain/State";
import { createApiStateRepository } from "@/modules/state/infra/ApiStateRepository";

interface StateSelectProps {
  selected?: number;
  onStateChange?: (value: number) => void;
}

const stateRepository = createApiStateRepository();
export const StateSelect = ({ selected, onStateChange }: StateSelectProps) => {
  const [states, setStates] = useState<State[]>([]);

  useEffect(() => {
    const loadStates = async () => {
      try {
        const states = await stateRepository.getAll();
        setStates(states);
      } catch (error) {
        console.error("Error al obtener los estados:", error);
      }
    };

    loadStates();
  }, []);

  const handleValueChange = (selectedId: string) => {
    const selectedState = states.find(
      (state) => String(state.id) === selectedId
    );
    if (onStateChange && selectedState) {
      onStateChange(selectedState.id);
    }
  };

  return (
    <Select value={String(selected)} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full ">
        <SelectValue placeholder="Seleccione la provincia..." />
      </SelectTrigger>
      <SelectContent>
        {states.map((state) => (
          <SelectItem key={state.id} value={String(state.id)}>
            {state.state}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
