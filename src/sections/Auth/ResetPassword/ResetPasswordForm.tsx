"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RiLock2Fill } from "react-icons/ri";
import { SubmitHandler, useForm } from "react-hook-form";
import { User } from "@/types/User/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import { createUser } from "@/modules/users/application/create/createUser";
import { toast } from "sonner";
import { goBack } from "@/lib/utils";
import { requestResetPassword } from "@/modules/users/application/request-reset-password/requestResetPassword";

interface Inputs extends User {}

function ResetPasswordForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Inputs>();
  const userRepository = createApiUserRepository();
  const createRequestFn = requestResetPassword(userRepository);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const playerCreationPromise = createRequestFn(data);
      toast.promise(playerCreationPromise, {
        loading: "Enviando correo electrónico...",
        success: "Correo enviado éxito!",
        duration: 3000,
      });
      await playerCreationPromise;
    } catch (error) {
      {
        toast.error("Error al crear el Jugador: Error desconocido", {
          duration: 3000,
        });
        console.error("Error al crear el paciente", error);
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-gray-100 p-6 md:p-10 rounded-lg shadow-lg w-full md:max-w-2xl">
          <div className="flex flex-col items-center">
            <RiLock2Fill size={80} />
            <h1 className="text-2xl font-bold text-center my-4">
              ¿Tienes problemas para entrar?
            </h1>
            <p className="text-center">
              Introduce tu correo electrónico y te enviaremos un enlace para
              restablecer su contraseña.
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="font-medium">
                Ingrese su correo electrónico
              </Label>
              <Input
                type="email"
                {...register("email", { required: true })}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
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

export default ResetPasswordForm;
