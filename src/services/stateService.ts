import axiosInstance from "./axiosConfig";

interface IState {
  id: string;
  state: string;
}

export const getStates = async (): Promise<IState[]> => {
  try {
    const response = await axiosInstance.get("states");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
