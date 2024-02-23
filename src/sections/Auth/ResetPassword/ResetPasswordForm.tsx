"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RiLock2Fill } from "react-icons/ri";

function ResetPasswordForm() {
  const [errors, setErrors] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  //   const { data: session } = useSession();

  //   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //     event.preventDefault();
  //     setErrors([]);

  //     const responseNextAuth = await signIn("credentials", {
  //       email,
  //       password,
  //       redirect: false,
  //     });

  //     if (responseNextAuth?.error) {
  //       setErrors(responseNextAuth.error.split(","));
  //       return;
  //     }

  //     router.push("/home");
  //   };

  //   useEffect(() => {
  //     if (session?.user) {
  //       router.push("/home");
  //     }
  //   }, [session, router]);

  return (
    <>
      <div className="flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-gray-100 p-6 md:p-10 rounded-lg shadow-lg w-full md:max-w-2xl">
          <div className="flex flex-col items-center">
            <RiLock2Fill size={80} />
            <h1 className="text-2xl font-bold text-center my-4">
            ¿Tienes problemas para entrar?
            </h1>
            <p className="text-center">Introduce tu correo electrónico y te enviaremos un enlace para restablecer su contraseña.</p>
          </div>
          <form className="mt-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="font-medium">
                Ingrese su correo electrónico
              </Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
            {errors.length > 0 && (
              <div className="alert alert-danger mt-2">
                <ul className="mb-0 text-red-500">
                  {errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
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
