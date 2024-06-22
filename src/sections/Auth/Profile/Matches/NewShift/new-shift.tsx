import { Label } from "@/components/ui/label";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewShift() {
  return (
    <section className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 flex flex-col space-y-4">
      <h2 className="text-2xl font-semibold">Reservar Turno de Tenis</h2>
      <div>
        <Label className="mb-2" htmlFor="court">
          Cancha
        </Label>
        <Select>
          <SelectTrigger id="court">
            <SelectValue placeholder="Seleccionar cancha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Cancha 1</SelectItem>
            <SelectItem value="2">Cancha 2</SelectItem>
            <SelectItem value="3">Cancha 3</SelectItem>
            <SelectItem value="4">Cancha 4</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-2" htmlFor="date">
            Fecha
          </Label>
          <Input id="date" type="date" />
        </div>
        <div>
          <Label className="mb-2" htmlFor="time">
            Hora
          </Label>
          <Input id="time" type="time" />
        </div>
      </div>
      <Button className="bg-green-500 hover:bg-green-600 text-white">
        Confirmar Reserva
      </Button>
    </section>
  );
}
