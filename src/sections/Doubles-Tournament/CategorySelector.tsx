"use client";
import React from "react";
import { DoublesEventCategory } from "@/types/Doubles-Event/DoublesEvent";

interface CategorySelectorProps {
  categories: DoublesEventCategory[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function CategorySelector({
  categories,
  selectedId,
  onSelect,
}: CategorySelectorProps) {
  const maleCategories = categories.filter((c) => c.gender === "male");
  const femaleCategories = categories.filter((c) => c.gender === "female");

  const renderPill = (cat: DoublesEventCategory) => {
    const isSelected = selectedId === cat.id;
    return (
      <button
        key={cat.id}
        onClick={() => onSelect(cat.id)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          isSelected
            ? "bg-slate-700 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        {cat.name}
      </button>
    );
  };

  return (
    <div className="space-y-2">
      {maleCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {maleCategories.map(renderPill)}
        </div>
      )}
      {femaleCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {femaleCategories.map(renderPill)}
        </div>
      )}
    </div>
  );
}
