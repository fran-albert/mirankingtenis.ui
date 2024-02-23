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
import { SubmitHandler, useForm } from "react-hook-form";
import { useCustomSession } from "@/context/SessionAuthProviders";

interface Inputs extends User {}

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const router = useRouter();
  const { session } = useCustomSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (session) {
      router.push("/inicio");
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
    console.log(email, password);
    console.log(result);

    setIsLoading(false);

    if (result?.error) {
      if (result.error === "No user found") {
        console.log("Usuario no encontrado");
      } else {
        console.log("Error al iniciar sesión");
      }
    } else {
      router.push("/inicio");
    }
  };

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
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input {...register("email", { required: true })} />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <PasswordInput {...register("password", { required: true })} />
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
