import { Fixture } from "@/types/Fixture/Fixture";
import axiosInstance from "@/services/axiosConfig";

export const getFixtureByCategory = async (idCategory: number): Promise<Fixture[]> => {
    const response = await axiosInstance.get(`fixture/by-category/${idCategory}`);
    const fixtures = response.data as Fixture[];
    return fixtures;
}