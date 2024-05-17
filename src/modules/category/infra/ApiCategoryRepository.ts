import axiosInstance from "@/services/axiosConfig";
import { CategoryRepository } from "../domain/CategoryRepository";
import { Category } from "../domain/Category";

export function createApiCategoryRepository(): CategoryRepository {

  async function getAllCategories(): Promise<Category[]> {
    const response = await axiosInstance.get(`categories`);
    const category = response.data as Category[];
    return category;
  }

  async function getTotalCategories(): Promise<number> {
    const response = await axiosInstance.get(`categories`);
    const category = response.data as Category[];
    return category.length;
  }

  //   async function getTotalPatients(): Promise<number> {
  //       const response = await axiosInstance.get(`Patient/all`, {});
  //       const patient = response.data as Patient[];
  //       const totalPatient = patient.length;
  //       return totalPatient;
  //   }

  async function createCategory(newCategory: Category): Promise<Category> {
    const response = await axiosInstance.post("categories", newCategory);
    const c = response.data as Category;
    return c;
  }

  async function deleteCategory(idCategory: number): Promise<string> {
    const response = await axiosInstance.delete(`categories/${idCategory}`);
    const patient = response.data;
    return patient;
  }

  return {
    getAllCategories, createCategory, deleteCategory, getTotalCategories
  };
}
