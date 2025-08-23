import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useAllCategories } from "@/hooks/Category";

function RankingTabs({
  onSelectCategory,
}: {
  onSelectCategory: (idCategory: number) => void;
}) {
  const { categories } = useAllCategories();
  const [activeCategory, setActiveCategory] = useState<number>(1);

  const handleSelectCategory = (idCategory: number) => {
    setActiveCategory(idCategory);
    onSelectCategory(idCategory);
  };

  const scrollLeft = () => {
    const currentIndex = categories.findIndex(cat => cat.id === activeCategory);
    const prevIndex = Math.max(0, currentIndex - 1);
    const prevCategory = categories[prevIndex];
    if (prevCategory) {
      setActiveCategory(prevCategory.id);
      onSelectCategory(prevCategory.id);
    }
  };

  const scrollRight = () => {
    const currentIndex = categories.findIndex(cat => cat.id === activeCategory);
    const nextIndex = Math.min(categories.length - 1, currentIndex + 1);
    const nextCategory = categories[nextIndex];
    if (nextCategory) {
      setActiveCategory(nextCategory.id);
      onSelectCategory(nextCategory.id);
    }
  };
  return (
    <div className="flex items-center justify-center py-2 px-4 bg-white rounded-lg shadow-md">
      <button
        onClick={scrollLeft}
        className="mr-2 hover:bg-gray-200 rounded-full p-1"
      >
        <FaArrowLeft className="h-6 w-6 text-gray-800" />
      </button>

      <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
        {categories.map((category) => (
          <span
            key={category.id}
            className={`whitespace-nowrap py-1 px-4 font-semibold ${
              category.id === activeCategory
                ? "bg-slate-700 text-white"
                : "hover:bg-slate-100"
            } rounded-full cursor-pointer transition-colors duration-200 ease-in-out`}
            onClick={() => handleSelectCategory(category.id)}
          >
            Categoría {category.name}
          </span>
        ))}
      </div>

      <button
        onClick={scrollRight}
        className="ml-2 hover:bg-gray-200 rounded-full p-1"
      >
        <FaArrowRight className="h-6 w-6 text-gray-800" />
      </button>
    </div>
  );
}
export default RankingTabs;
