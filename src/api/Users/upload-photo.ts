import axiosInstance from "@/services/axiosConfig";

export const updatePhoto = async (
    updatedUser: FormData,
    idUser: number
): Promise<string> => {
    const response = await axiosInstance.patch(
        `users/${idUser}/upload-photo`,
        updatedUser,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    const user = response.data;
    return user;
}