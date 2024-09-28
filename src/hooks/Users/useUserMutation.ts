import { createUser } from "@/api/Users/create";
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

//   const updatePatientMutation = useMutation({
//     mutationFn: ({ id, patient }: { id: number; patient: Patient }) => updatePatient(id, patient),
//     onSuccess: (patient, variables, context) => {
//       queryClient.invalidateQueries({ queryKey: ['patient', variables.id] });
//       console.log("Patient updated", patient, variables, context);
//     },
//     onError: (error, variables, context) => {
//       console.log("Error updating patient", error, variables, context);
//     },
//   });

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

  return { addUserMutation };
};