import { createCategory } from "@/api/Category/create-category";
import { deleteCategory } from "@/api/Category/delete-category";
import { Category } from "@/modules/category/domain/Category";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (category, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', 'total'] });
      console.log("Category created", category, variables, context);
    },
    onError: (error: any, variables, context) => {
      console.log("Error creating category:", error.response?.data || error.message, variables, context);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (result, idCategory, context) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', 'total'] });
      console.log("Category deleted", result, idCategory, context);
    },
    onError: (error: any, variables, context) => {
      console.log("Error deleting category:", error.response?.data || error.message, variables, context);
    },
  });

  return { 
    createCategoryMutation, 
    deleteCategoryMutation 
  };
};