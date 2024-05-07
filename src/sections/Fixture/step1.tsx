import { TournamentSelect } from "@/components/Select/Tournament/select";
import { Button } from "@/components/ui/button";

interface Step0Props {
  onNext: () => void;
  onTournamentSelect: (idTournament: number) => void;
}

export const Step1 = ({ onNext, onTournamentSelect }: Step0Props) => {
  const handleTournamentChange = (idTournament: string) => {
    onTournamentSelect(Number(idTournament));
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-4xl px-8 py-10 sm:px-10 sm:py-12 md:px-12 md:py-14 lg:px-20 lg:py-20 bg-white shadow-lg rounded-lg">
        <p className="text-xl sm:text-2xl md:text-3xl">Elija el Torneo</p>
        <TournamentSelect
          onTournament={handleTournamentChange}
          className="bg-white my-5"
        />
        <div className="flex justify-center mt-4">
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
