import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllCategories } from "@/hooks/Category";

interface CategorySelectProps {
  selected?: string;
  onCategory?: (value: string) => void;
  className?: string;
}

export const CategorySelect = ({
  selected,
  onCategory,
  className,
}: CategorySelectProps) => {
  const { categories } = useAllCategories();

  return (
    <Select value={selected} onValueChange={onCategory}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Seleccione la categoría..." />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id} value={String(category.id)}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
