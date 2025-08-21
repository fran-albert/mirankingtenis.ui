import { createUser } from "@/api/Users/create";
import { updateUser } from "@/api/Users/update-user";
import { resetUserPassword } from "@/api/Users/reset-password";
import { deleteUser } from "@/api/Users/delete-user";
import { changePassword } from "@/api/Users/change-password";
import { requestResetPassword } from "@/api/Users/request-reset-password";
import { updatePhoto } from "@/api/Users/upload-photo";
import { resetPasswordWithToken } from "@/api/Users/reset-password-with-token";
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

  const resetPasswordMutation = useMutation({
    mutationFn: (userId: number) => resetUserPassword(userId),
    onSuccess: (response, userId, context) => {
      console.log("Password reset successfully", response, userId, context);
    },
    onError: (error, variables, context) => {
      console.log("Error resetting password", error, variables, context);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: (response, userId, context) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      console.log("User deleted successfully", response, userId, context);
    },
    onError: (error, variables, context) => {
      console.log("Error deleting user", error, variables, context);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: User }) => changePassword(userId, data),
    onSuccess: (response, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
      console.log("Password changed successfully", response, variables, context);
    },
    onError: (error, variables, context) => {
      console.log("Error changing password", error, variables, context);
    },
  });

  const requestResetPasswordMutation = useMutation({
    mutationFn: (email: User) => requestResetPassword(email),
    onSuccess: (response, variables, context) => {
      console.log("Reset password requested successfully", response, variables, context);
    },
    onError: (error, variables, context) => {
      console.log("Error requesting password reset", error, variables, context);
    },
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: ({ formData, idUser }: { formData: FormData; idUser: number }) => updatePhoto(formData, idUser),
    onSuccess: (response, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.idUser] });
      console.log("Photo uploaded successfully", response, variables, context);
    },
    onError: (error, variables, context) => {
      console.log("Error uploading photo", error, variables, context);
    },
  });

  const resetPasswordWithTokenMutation = useMutation({
    mutationFn: ({ token, password, confirmPassword }: { token: string; password: string; confirmPassword: string }) => 
      resetPasswordWithToken(token, password, confirmPassword),
    onSuccess: (response, variables, context) => {
      console.log("Password reset with token successfully", response, variables, context);
    },
    onError: (error, variables, context) => {
      console.log("Error resetting password with token", error, variables, context);
    },
  });

  return { 
    addUserMutation, 
    updateUserMutation, 
    resetPasswordMutation, 
    deleteUserMutation, 
    changePasswordMutation, 
    requestResetPasswordMutation, 
    uploadPhotoMutation,
    resetPasswordWithTokenMutation
  };
};