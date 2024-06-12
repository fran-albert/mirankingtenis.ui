import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCategoriesStore } from "@/hooks/useCategories";
import { Category } from "@/modules/category/domain/Category";

interface CheckboxGroupCategoriesProps {
  onSelectCategories: (categoryIds: number[]) => void;
}

const CheckboxGroupCategories: React.FC<CheckboxGroupCategoriesProps> = ({
  onSelectCategories,
}) => {
  const { categories, loading, fetchCategories } = useCategoriesStore();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories((prevSelected) => {
      const isSelected = prevSelected.includes(categoryId);
      const updatedSelection = isSelected
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId];
      onSelectCategories(updatedSelection);
      return updatedSelection;
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {categories.map((category: Category) => (
        <div key={category.id} className="flex items-center space-x-2">
          <Checkbox
            checked={selectedCategories.includes(category.id)}
            onChange={() => handleCategoryChange(category.id)}
            id={`category-${category.id}`}
          />
          <Label htmlFor={`category-${category.id}`}>
            Categoría {category.name}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default CheckboxGroupCategories;
