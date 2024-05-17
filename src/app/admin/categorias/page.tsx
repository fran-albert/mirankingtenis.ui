"use client";
import Loading from "@/components/Loading/loading";
import { useCustomSession } from "@/context/SessionAuthProviders";
import useRoles from "@/hooks/useRoles";
import { getAllCategories } from "@/modules/category/application/get-all/getAllCategories";
import { Category } from "@/modules/category/domain/Category";
import { createApiCategoryRepository } from "@/modules/category/infra/ApiCategoryRepository";
import { getAdminUsers } from "@/modules/users/application/get-all-admin/getAdminUsers";
import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import CategoriesTable from "@/sections/Admin/Categories/Table/table";
import AdminPlayersTanstackTable from "@/sections/Admin/Players/Table/tanstack";
import { PlayersTable } from "@/sections/Players/Table/table";
import React, { useCallback, useEffect, useMemo, useState } from "react";

function CategoriesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const categoryRepository = useMemo(() => createApiCategoryRepository(), []);
  const loadAllCategories = useCallback(async () => {
    const users = await getAllCategories(categoryRepository)();
    return users;
  }, [categoryRepository]);
  const { isAdmin } = useRoles();
  const { session } = useCustomSession();
  const canAddUser = !!session && isAdmin;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const catDate = await loadAllCategories();
        setCategories(catDate);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [loadAllCategories]);

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
