import axiosInstance from "@/services/axiosConfig";
import { CategoryRepository } from "../domain/CategoryRepository";
import { Category } from "../domain/Category";

export function createApiCategoryRepository(): CategoryRepository {
  //   async function getCategory(
  //     id: number,
  //     token: string
  //   ): Promise<Category | undefined> {
  //     const response = await axiosInstance.get(`Account/user?id=${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     const patient = response.data as Patient;
  //     return patient;
  //   }

  async function getAllCategories(): Promise<Category[]> {
    const response = await axiosInstance.get(`categories`);
    const category = response.data as Category[];
    return category;
  }

  //   async function getTotalPatients(): Promise<number> {
  //       const response = await axiosInstance.get(`Patient/all`, {});
  //       const patient = response.data as Patient[];
  //       const totalPatient = patient.length;
  //       return totalPatient;
  //   }

  //   async function createPatient(newPatient: Patient): Promise<Patient> {
  //     const response = await axiosInstance.post("patient/create", newPatient);
  //     const patient = response.data as Patient;
  //     return patient;
  //   }

  //   async function deletePatient(idPatient: number): Promise<Patient> {
  //     const response = await axiosInstance.delete(`Patient/${idPatient}`);
  //     const patient = response.data as Patient;
  //     return patient;
  //   }

  return {
    getAllCategories,
    // getPatient,
    // getAll,
    // createPatient,
    // deletePatient,
    // getTotalPatients,
  };
}
