import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStates } from "@/services/stateService";

interface StateSelectProps {
  selected?: string;
  onStateChange?: (value: string) => void;
}

interface IState {
  id: string;
  state: string;
}
export const StateSelect = ({ selected, onStateChange }: StateSelectProps) => {
  const [states, setStates] = useState<IState[]>([]);

  useEffect(() => {
    const loadStates = async () => {
      try {
        const states = await getStates();
        setStates(states);
      } catch (error) {
        console.error("Error al obtener los estados:", error);
      }
    };

    loadStates();
  }, []);

  return (
    <Select value={selected} onValueChange={onStateChange}>
      <SelectTrigger className="w-full bg-gray-200 border-gray-300 text-gray-800">
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
