"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/passwordInput";
import Loading from "@/components/Loading/loading";
import { Separator } from "@/components/ui/separator";
import { User } from "@/modules/users/domain/User";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useCustomSession } from "@/context/SessionAuthProviders";

interface Inputs extends User {}

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    control,
  } = useForm<Inputs>();
  const router = useRouter();
  const { session } = useCustomSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");
  useEffect(() => {
    if (session) {
      router.push("/mi-perfil");
    }
  }, [session, router]);
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { email, password } = data;
    setIsLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      if (result.error === "No user found") {
        setLoginError("Usuario no encontrado.");
      } else {
        setLoginError("Error al iniciar sesión: " + result.error);
      }
    }
  };

  useEffect(() => {
    if (session) {
      // Asegúrate de que tu objeto de sesión incluya el ID del usuario de alguna manera.
      router.push(`/jugadores/${session.user.id}`);
    }
  }, [session, router]);

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className="flex items-start justify-center p-2 mt-5 ">
        <div className="bg-gray-100 p-4 md:p-14 rounded-lg shadow-md w-full md:max-w-lg ">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h1 className="text-lg md:text-2xl font-bold text-center">
              Iniciar Sesión
            </h1>{" "}
            {loginError && (
              <div className="text-red-500 text-center">{loginError}</div>
            )}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input {...register("email", { required: true })} />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => <PasswordInput {...field} />}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" className="bg-white" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Recordarme
              </label>
            </div>
            <Button
              type="submit"
              className="mx-auto w-1/2 md:w-1/2 bg-slate-600"
            >
              Ingresar
            </Button>
            <Separator />
            <div className="text-center text-slate-700 font-bold">
              <a href="/restablecer-contrase%C3%B1a">
                ¿Has olvidado tu contraseña?
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
