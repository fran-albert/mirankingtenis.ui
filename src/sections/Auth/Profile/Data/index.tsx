import React, { useState } from "react";
import { User } from "@/modules/users/domain/User";
import { Button } from "@/components/ui/button";
import { CategorySelect } from "@/components/Select/Category/select";
import { CitySelect } from "@/components/Select/City/select";
import { StateSelect } from "@/components/Select/State/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { goBack } from "@/lib/utils";
import { createUser } from "@/modules/users/application/create/createUser";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
interface Inputs extends User {}
function DataIndex({ user }: { user: User | undefined }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Inputs>();
  const [selectedState, setSelectedState] = useState(user?.city.idState.toString());
  const [selectedCity, setSelectedCity] = useState(user?.city.id.toString());
  const [selectedCategory, setSelectedCategory] = useState(user?.category.id.toString());
  const userRepository = createApiUserRepository();
  const createUserFn = createUser(userRepository);

  console.log(user)

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
        console.error("Error al crear el jugador", errorMessage);
      } else {
        toast.error("Error al crear el Jugador: Error desconocido", {
          duration: 3000,
        });
        console.error("Error al crear el jugador", error);
      }
    }
  };
  return (
    <>
      <div className="flex flex-wrap items-center justify-center rounded-lg p-4 ">
        <div className="w-full p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  {...register("name", { required: true })}
                  className="w-full bg-gray-200 border-gray-300 text-gray-800"
                  defaultValue={user?.name}
                />
              </div>
              <div>
                <Label htmlFor="lastname">Apellido</Label>
                <Input
                  {...register("lastname", { required: true })}
                  className="w-full bg-gray-200 border-gray-300 text-gray-800"
                  defaultValue={user?.lastname}
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  {...register("phone", { required: true })}
                  className="w-full bg-gray-200 border-gray-300 text-gray-800"
                  defaultValue={user?.phone}
                />
              </div>
              <div>
              <Label htmlFor="category">Categoría</Label>
                <CategorySelect
                  selected={selectedCategory}
                  onCategory={(value) => {
                    setSelectedCategory(value);
                    setValue("idCategory", value);
                  }}
                />
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
                defaultValue={user?.email}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <Button
                className="w-full sm:w-auto"
                variant="outline"
                type="submit"
              >
                Modificar Datos
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default DataIndex;
