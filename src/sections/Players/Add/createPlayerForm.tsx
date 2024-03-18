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
      <div className="flex flex-wrap items-center justify-center bg-gray-50 border shadow-2xl rounded-lg p-4 w-full sm:w-1/2">
        <div className="w-full p-4">
          <p className="text-xl font-bold text-center">Agregar Jugador</p>
          <div className="my-4">
            <hr />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  {...register("name", { required: true })}
                  className="w-full bg-gray-200 border-gray-300 text-gray-800"
                />
              </div>
              <div>
                <Label htmlFor="lastname">Apellido</Label>
                <Input
                  {...register("lastname", { required: true })}
                  className="w-full bg-gray-200 border-gray-300 text-gray-800"
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  {...register("phone", { required: true })}
                  className="w-full bg-gray-200 border-gray-300 text-gray-800"
                />
              </div>
              <div className="md:flex md:gap-4">
                <div className="flex-1">
                  <Label htmlFor="category">Categoría</Label>
                  <CategorySelect
                    selected={selectedCategory}
                    onCategory={(value) => {
                      setSelectedCategory(value);
                      setValue("idCategory", value);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="category">Ranking Inicial</Label>
                  <Input
                    {...register("rankingInitial", { required: true })}
                    className="w-full bg-gray-200 border-gray-300 text-gray-800"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="state">Provincia</Label>
                <StateSelect
                  selected={selectedState}
                  onStateChange={setSelectedState}
                />
              </div>
              <div>
                <Label htmlFor="city">Localidad</Label>
                <CitySelect
                  idState={selectedState}
                  selected={selectedCity}
                  onCityChange={(value) => {
                    setSelectedCity(value);
                    setValue("idCity", value);
                  }}
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="userName">Correo Electrónico</Label>
              <Input
                id="email"
                className="w-full bg-gray-200 border-gray-300 text-gray-800"
                {...register("email")}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <Button
                className="w-full sm:w-auto"
                variant="destructive"
                onClick={goBack}
              >
                Cancelar
              </Button>
              <Button
                className="w-full sm:w-auto"
                variant="default"
                type="submit"
              >
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
