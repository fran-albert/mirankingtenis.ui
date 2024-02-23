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
import { createApiUserRepositroy } from "@/modules/users/infra/ApiUserRepository";
import axios from "axios";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

interface Inputs extends User {}

function CreatePlayerForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Inputs>();
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const userRepository = createApiUserRepositroy();
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
      <div className="flex items-center justify-center bg-gray-50 border shadow-2xl rounded-lg p-4 w-1/2">
        <div className="relative p-8 rounded-xl w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-grow">
              <p className="text-xl font-bold text-center">Agregar Jugador</p>
            </div>
          </div>
          <Separator />
          <hr />
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-row mt-2">
              <div className="flex-1 pr-1">
                <div className="mb-2 block ">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    {...register("name", { required: true })}
                    className="bg-gray-200 border-gray-300 text-gray-800"
                  />
                </div>
              </div>
              <div className="flex-1 pl-1">
                <div className="mb-2 block">
                  <Label htmlFor="lastname">Apellido</Label>
                  <Input
                    {...register("lastname", { required: true })}
                    className="bg-gray-200 border-gray-300 text-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <div className="flex-1 pr-1">
                <div className="mb-2 block">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    {...register("phone", { required: true })}
                    className="bg-gray-200 border-gray-300 text-gray-800"
                  />
                </div>
              </div>
              <div className="flex-1 pl-1">
                <div className="mb-2 block">
                  <Label htmlFor="healthInsurance">Imagen</Label>
                  <Input
                    {...register("photo")}
                    className="bg-gray-200 border-gray-300 text-gray-800"
                    type=""
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <div className="flex-1 pr-1">
                <div className="mb-2 block">
                  <Label htmlFor="userName">Correo Electronico</Label>
                  <Input
                    id="email"
                    className="bg-gray-200 border-gray-300 text-gray-800"
                    {...register("email")}
                  />
                </div>
              </div>
              <div className="flex-1 pl-1">
                <div className="mb-2 block">
                  <Label htmlFor="birthdate">Categoría</Label>
                  <CategorySelect
                    selected={selectedCategory}
                    onCategory={(value) => {
                      setSelectedCategory(value);
                      setValue("idCategory", parseInt(value, 10));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <div className="flex-1 pr-1">
                <div className="mb-2 block">
                  <Label htmlFor="state">Provincia</Label>
                  <StateSelect
                    selected={selectedState}
                    onStateChange={setSelectedState}
                  />
                </div>
              </div>
              <div className="flex-1 pl-1">
                <div className="mb-2 block">
                  <Label htmlFor="city">Localidad</Label>
                  <CitySelect
                    idState={selectedState}
                    selected={selectedCity}
                    onCityChange={(value) => {
                      setSelectedCity(value);
                      setValue("idCity", parseInt(value, 10));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Button className="mt-10 m-2" variant="destructive" onClick={goBack}>
                Cancelar
              </Button>
              <Button className="mt-10 m-2" variant="default" type="submit">
                Agregar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreatePlayerForm;
