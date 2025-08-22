import { Fixture } from "@/types/Fixture/Fixture";
import axiosInstance from "@/services/axiosConfig";

export const createFixture = async (newFixture: Fixture): Promise<Fixture> => {
    const response = await axiosInstance.post(`fixture/generate`, newFixture);
    const fixture = response.data as Fixture;
    return fixture;
}