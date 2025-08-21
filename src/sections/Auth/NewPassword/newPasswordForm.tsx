"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { FaUnlockAlt } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { PasswordInput } from "@/components/ui/passwordInput";
import { useUserMutations } from "@/hooks/Users/useUserMutation";
import axios from "axios";
interface Inputs {
  password: string;
  confirmPassword: string;
  general: string;
}

function NewPasswordForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
    setValue,
  } = useForm<Inputs>();
  const { resetPasswordWithTokenMutation } = useUserMutations();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const onSubmit = async (data: any) => {
    try {
      const userResetPromise = resetPasswordWithTokenMutation.mutateAsync({
        token: token as string,
        password: data.password,
        confirmPassword: data.confirmPassword
      });
      toast.promise(userResetPromise, {
        loading: "Actualizando contraseña...",
        success: "Contraseña actualizada con éxito!",
        duration: 3000,
      });
      await userResetPromise;
      router.push("/iniciar-sesion");
    } catch (error) {
      let errorMessage = "Error al actualizar la contraseña: Error desconocido";
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;
        if (serverMessage) {
          errorMessage = serverMessage;
        }
      }

      console.error(errorMessage, error);

      setError("general", { type: "manual", message: errorMessage });
    }
  };
  return (
    <>
      <div className="flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-gray-100 p-6 md:p-10 rounded-lg shadow-lg w-full md:max-w-2xl">
          <div className="flex flex-col items-center">
            <FaUnlockAlt size={80} />
            <h1 className="text-2xl font-bold text-center my-4">
              Ingresa tu nueva contraseña
            </h1>
            <p className="text-center">
              Introduce tu nueva contraseña y confírmala para poder acceder a tu
              cuenta.
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              {errors.general && (
                <p className="text-red-500">{errors.general.message}</p>
              )}

              <Label htmlFor="password" className="font-medium">
                Ingrese su nueva contraseña
              </Label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => <PasswordInput {...field} />}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword" className="font-medium">
                Confirme su nueva contraseña
              </Label>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => <PasswordInput {...field} />}
              />
            </div>

            <button
              type="submit"
              className="py-2 px-4 bg-slate-500 text-white font-bold rounded-lg hover:bg-slate-700 transition duration-300 ease-in-out"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default NewPasswordForm;
