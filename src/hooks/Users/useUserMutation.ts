import { createUser } from "@/api/Users/create";
import { updateUser } from "@/api/Users/update-user";
import { User } from "@/types/User/User";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUserMutations = () => {
  const queryClient = useQueryClient();

  const addUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (patient, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      console.log("users created", patient, variables, context);
    },

    onError: (error: any, variables, context) => {
      console.log("Error details:", error.response?.data || error.message, variables, context);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ user, id }: { user: Partial<User>; id: number }) => updateUser(user as User, id),
    onSuccess: (patient, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      console.log("Patient updated", patient, variables, context);
    },
    onError: (error, variables, context) => {
      console.log("Error updating patient", error, variables, context);
    },
  });

  //   const deletePatientMutation = useMutation({
  //     mutationFn: (id: number) => deletePatient(id),
  //     onSuccess: (patient, variables, context) => {
  //       queryClient.invalidateQueries({ queryKey: ['patients'] })
  //       console.log("Patient deleted", patient, variables, context);
  //     },
  //     onError: (error, variables, context) => {
  //       console.log("Error deleting patient", error, variables, context);
  //     },
  //   });

  return { addUserMutation, updateUserMutation };
};