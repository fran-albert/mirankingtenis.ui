"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/passwordInput";
import Loading from "@/components/Loading/loading";
import { Separator } from "@/components/ui/separator";
import { User } from "@/types/User/User";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { useAuth } from "@/context/AuthProvider";

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
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setLoginError("");
    
    try {
      const { email, password } = data;
      await login(email, password);
      // El router.push se maneja en el useEffect cuando session cambie
    } catch (error: any) {
      setLoginError(error.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
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
            </h1>
            {loginError && (
              <div className="text-red-500 text-center">{loginError}</div>
            )}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  {...register("email", {
                    required: "Este campo es obligatorio",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                      message: "Introduce un correo electrónico válido",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs italic">
                    {errors.email.message}
                  </p>
                )}
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
