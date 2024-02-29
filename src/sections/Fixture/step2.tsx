import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Step2 = ({
  onNext,
  onBack,
  onJornadaSelect,
}: {
  onNext: any;
  onBack: any;
  onJornadaSelect: any;
}) => {
  const selectJornada = (value: any) => {
    onJornadaSelect(value);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-4xl px-8 py-10 sm:px-10 sm:py-12 md:px-12 md:py-14 lg:px-20 lg:py-20 bg-white shadow-lg rounded-lg">
        <p className="text-xl sm:text-2xl md:text-3xl">Elija la fecha</p>
        <Select onValueChange={selectJornada}>
          <SelectTrigger className="my-5">
            <SelectValue placeholder="Seleccione fecha..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Fecha 1</SelectItem>
            <SelectItem value="2">Fecha 2</SelectItem>
            <SelectItem value="3">Fecha 3</SelectItem>
            <SelectItem value="4">Fecha 4</SelectItem>
            <SelectItem value="5">Fecha 5</SelectItem>
            <SelectItem value="6">Fecha 6</SelectItem>
            <SelectItem value="7">Fecha 7</SelectItem>
            <SelectItem value="8">Fecha 8</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex justify-center space-x-4 mt-6">
          <Button
            onClick={onBack}
            className="px-4 py-2 rounded-md bg-slate-500 text-white hover:bg-slate-700 transition-colors"
          >
            Anterior
          </Button>
          <Button
            onClick={onNext}
            className="px-4 py-2 rounded-md bg-slate-500 text-white hover:bg-slate-700 transition-colors"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};
