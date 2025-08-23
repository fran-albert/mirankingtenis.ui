"use client";
import Loading from "@/components/Loading/loading";
import { useCustomSession } from "@/context/SessionAuthProviders";
import useRoles from "@/hooks/useRoles";
import CategoriesTable from "@/sections/Admin/Categories/Table/table";
import AdminPlayersTanstackTable from "@/sections/Admin/Players/Table/tanstack";
import { PlayersTable } from "@/sections/Players/Table/table";
import { Category } from "@/types/Category/Category";
import { useAllCategories } from "@/hooks/Category";
import React, { useState } from "react";

function CategoriesPage() {
  const { categories: allCategories, isLoading } = useAllCategories();
  const [categories, setCategories] = useState<Category[]>([]);
  const { isAdmin } = useRoles();
  const { session } = useCustomSession();
  const canAddUser = !!session && isAdmin;

  // Sincronizar categorías cuando se cargan
  React.useEffect(() => {
    if (allCategories.length > 0) {
      setCategories(allCategories);
    }
  }, [allCategories]);

  const handlePlayerDeleted = (idPlayer: number) => {
    setCategories((currentPlayers) =>
      currentPlayers.filter((player) => player.id !== idPlayer)
    );
  };

  const addCategoryToList = (newCategory: Category) => {
    setCategories((currentCategories) => [...currentCategories, newCategory]);
  };

  const removeCategoryFromList = (idCategory: number) => {
    setCategories((currentCategories) =>
      currentCategories.filter((cat) => Number(cat.id) !== idCategory)
    );
  };

  if (isLoading) {
    return <Loading isLoading={true} />;
  }

  return (
    <div>
      <CategoriesTable
        categories={categories}
        addCategoryToList={addCategoryToList}
        removeCategoryFromList={removeCategoryFromList}
      />
    </div>
  );
}

export default CategoriesPage;
