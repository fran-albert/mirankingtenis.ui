import { updatePhoto } from "@/api/Users/upload-photo";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUserMutations = () => {
    const queryClient = useQueryClient();

    const uploadPhotoMutations = useMutation({
        mutationFn: async (variables: { formData: FormData; idUser: number }) => {
            return updatePhoto(variables.formData, variables.idUser);
        },
        onSuccess: (patient, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            console.log("users created", patient, variables, context);
        },

        onError: (error: any, variables, context) => {
            console.log("Error details:", error.response?.data || error.message, variables, context);
        },
    });


    return { uploadPhotoMutations, };
};