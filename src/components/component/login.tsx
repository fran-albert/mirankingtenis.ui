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
import Image from "next/image";
import { User } from "@/modules/users/domain/User";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useCustomSession } from "@/context/SessionAuthProviders";

interface Inputs extends User {}

export function Login() {
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
      router.push(`/jugadores/${session.user.id}`);
    }
  }, [session, router]);

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="hidden lg:flex lg:items-center lg:justify-center lg:bg-white dark:lg:bg-gray-800">
          <Image
            src="https://mirankingtenis.com.ar/wp-content/uploads/2023/05/oficialLogin.png"
            alt="Your Company"
            quality={100}
            width={800}
            height={800}
          />
        </div>
        <div className="flex items-center justify-center p-6 lg:p-10">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="  rounded-lg md:p-8 p-2 mt-5">
              <div className="mx-auto w-[350px] space-y-6  p-4">
                <div className="space-y-2 text-center">
                  <h1 className="text-xl font-bold">Iniciar Sesión</h1>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input {...register("email", { required: true })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => <PasswordInput {...field} />}
                    />
                  </div>
                  {loginError && (
                    <div className="text-red-500 text-center">{loginError}</div>
                  )}
                  <Button type="submit" className="w-full bg-slate-600">
                    Ingresar
                  </Button>
                  <Separator />
                  <div className="text-center text-slate-700 font-bold">
                    <a href="/restablecer-contrase%C3%B1a">
                      ¿Has olvidado tu contraseña?
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
