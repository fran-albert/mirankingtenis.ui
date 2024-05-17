"use client";
import { CategorySelect } from "@/components/Select/Category/select";
import { CitySelect } from "@/components/Select/City/select";
import { StateSelect } from "@/components/Select/State/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { goBack } from "@/lib/utils";
import { createUser } from "@/modules/users/application/create/createUser";
import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import axios from "axios";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { IoMdArrowRoundBack } from "react-icons/io";
import { capitalizeWords } from "@/common/helpers/helpers";

interface Inputs extends User {}

function CreatePlayerForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Inputs>();
  const [selectedState, setSelectedState] = useState(0);
  const [selectedCity, setSelectedCity] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const userRepository = createApiUserRepository();
  const createUserFn = createUser(userRepository);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const playerCreationPromise = createUserFn(data);
      toast.promise(playerCreationPromise, {
        loading: "Creando jugador...",
        success: "Jugador creado con éxito!",
        duration: 3000,
      });
      await playerCreationPromise;
      goBack();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Error desconocido al crear el jugador";
        toast.error(`Error al crear el Jugador: ${errorMessage}`, {
          duration: 3000,
        });
        console.error("Error al crear el paciente", errorMessage);
      } else {
        toast.error("Error al crear el Jugador: Error desconocido", {
          duration: 3000,
        });
        console.error("Error al crear el paciente", error);
      }
    }
  };

  return (
    <>
      <div key="1" className="w-full">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>
                <button
                  className="flex items-center justify-start w-full"
                  onClick={goBack}
                  type="button"
                >
                  <IoMdArrowRoundBack className="text-black mr-2" size={25} />
                  Agregar Jugador
                </button>
              </CardTitle>
              <CardDescription>
                Completa los campos para agregar un nuevo jugador.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-2 gap-6">
                {/* <div className="col-span-2 flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  alt="Patient Avatar"
                  src="/placeholder-avatar.jpg"
                />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <Button variant="outline">Upload Photo</Button>
            </div> */}
                {/* <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                
              </div> */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      placeholder="Ingresar nombre"
                      {...register("name", {
                        required: "Este campo es obligatorio",
                        minLength: {
                          value: 2,
                          message: "El nombre debe tener al menos 2 caracteres",
                        },
                        onChange: (e) => {
                          const capitalized = capitalizeWords(e.target.value);
                          setValue("name", capitalized, {
                            shouldValidate: true,
                          });
                        },
                      })}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs italic">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname">Apellido</Label>
                    <Input
                      id="lastname"
                      placeholder="Ingresar apellido"
                      {...register("lastname", {
                        required: "Este campo es obligatorio",
                        minLength: {
                          value: 2,
                          message:
                            "El apellido debe tener al menos 2 caracteres",
                        },
                        onChange: (e) => {
                          const capitalized = capitalizeWords(e.target.value);
                          setValue("lastname", capitalized, {
                            shouldValidate: true,
                          });
                        },
                      })}
                    />
                    {errors.lastname && (
                      <p className="text-red-500 text-xs italic">
                        {errors.lastname.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Correo Electrónico</Label>
                    <Input
                      id="email"
                      placeholder="Ingresar correo electrónico"
                      {...register("email", {
                        required: "Este campo es obligatorio",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                          message: "Introduce un correo electrónico válido",
                        },
                      })}
                      type="email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs italic">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname">Teléfono</Label>
                    <Input
                      id="phone"
                      placeholder="Ingresar teléfono"
                      {...register("phone", {
                        required: "Este campo es obligatorio",
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "El Teléfono debe contener solo números",
                        },
                      })}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs italic">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Categoría</Label>
                    <CategorySelect
                      selected={selectedCategory}
                      onCategory={(value) => {
                        setSelectedCategory(value);
                        setValue("idCategory", value);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Ranking Inicial</Label>
                    <Input
                      id="rankingInitial"
                      placeholder="Ingresar ranking inicial"
                      {...register("rankingInitial", {
                        required: "Este campo es obligatorio",
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "El Ranking debe contener solo números",
                        },
                      })}
                    />
                    {errors.rankingInitial && (
                      <p className="text-red-500 text-xs italic">
                        {errors.rankingInitial.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="state">Provincia</Label>
                    <StateSelect
                      selected={Number(selectedState)}
                      onStateChange={setSelectedState}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Localidad</Label>
                    <CitySelect
                      idState={Number(selectedState)}
                      selected={String(selectedCity)}
                      onCityChange={(value) => {
                        setSelectedCity(Number(value));
                        setValue("idCity", value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={goBack}>
                Cancelar
              </Button>
              <Button variant="default" type="submit">
                Confirmar
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}

export default CreatePlayerForm;
