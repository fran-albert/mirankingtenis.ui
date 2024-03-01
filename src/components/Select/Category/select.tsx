import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/modules/category/domain/Category";
import { CategoryRepository } from "@/modules/category/domain/CategoryRepository";
import { createApiCategoryRepository } from "@/modules/category/infra/ApiCategoryRepository";
import { useEffect, useState } from "react";

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
  const [category, setCategories] = useState<Category[]>([]);
  const categoryRepository = createApiCategoryRepository();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await categoryRepository.getAllCategories();
        setCategories(categories);
      } catch (error) {
        console.error("Error al obtener los estados:", error);
      }
    };

    loadCategories();
  }, [categoryRepository]);

  return (
    <Select value={selected} onValueChange={onCategory}>
      <SelectTrigger className={`w-full ${className ? className : 'bg-gray-200 border-gray-300 text-gray-800'}`}>
        <SelectValue placeholder="Seleccione la categoría..." />
      </SelectTrigger>
      <SelectContent>
        {category.map((category) => (
          <SelectItem key={category.id} value={String(category.id)}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
