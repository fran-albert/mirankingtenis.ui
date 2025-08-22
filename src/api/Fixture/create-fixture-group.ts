import axiosInstance from "@/services/axiosConfig";

export const createFixtureGroup = async (idTournament: number, idCategory: number): Promise<string> => {
    const response = await axiosInstance.post(`fixture/create-fixture-group-master/${idTournament}/${idCategory}`);
    const fixture = response.data as string;
    return fixture;
}