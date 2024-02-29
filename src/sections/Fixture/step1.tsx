// Step1.js
import { CategorySelect } from "@/components/Select/Category/select";
import { Button } from "@/components/ui/button";

interface Step1Props {
  onNext: () => void;
  onCategorySelect: (idCategory: number) => void;
}

export const Step1 = ({ onNext, onCategorySelect }: Step1Props) => {
  const handleCategoryChange = (idCategory: string) => {
    onCategorySelect(Number(idCategory));
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-4xl px-8 py-10 sm:px-10 sm:py-12 md:px-12 md:py-14 lg:px-20 lg:py-20 bg-white shadow-lg rounded-lg">
        <p className="text-xl sm:text-2xl md:text-3xl">Elija la categoría</p>
        <CategorySelect
          onCategory={handleCategoryChange}
          className="bg-white my-5"
        />
        <div className="flex justify-center mt-6">
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
