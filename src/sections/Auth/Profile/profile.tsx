import { useCustomSession } from "@/context/SessionAuthProviders";
import { getUser } from "@/modules/users/application/get/getUser";
import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import Image from "next/image";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { FaPencilAlt } from "react-icons/fa";
import Loading from "@/components/Loading/loading";
import DataIndex from "./Data";
import { Button } from "@/components/ui/button";
import { CategorySelect } from "@/components/Select/Category/select";
import { CitySelect } from "@/components/Select/City/select";
import { StateSelect } from "@/components/Select/State/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { goBack } from "@/lib/utils";
import { createUser } from "@/modules/users/application/create/createUser";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { updateUser } from "@/modules/users/application/update/updateUser";
import ImageContainer from "./Image-Container";

interface Inputs extends User {
  [key: string]: any;
}

function Profile() {
  const { session } = useCustomSession();
  const idUser = session?.user.id as number;
  const [user, setUser] = useState<User | undefined>(undefined);
  const userRepository = createApiUserRepository();
  const loadUser = getUser(userRepository);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Inputs>();
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const updateUserFn = updateUser(userRepository);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await loadUser(idUser);
        if (userData && userData.city && userData.category) {
          setUser(userData);
          setIsLoading(false);

          setSelectedState(userData.city.idState.toString());
          setSelectedCity(userData.city.id.toString());
          setSelectedCategory(userData.category.id.toString());

          setValue("idCity", userData.city.id.toString());
          setValue("idCategory", userData.category.id.toString());
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [idUser, loadUser, setValue]);

  const handleStateChange = (value: string) => {
    setSelectedState(value);

    setSelectedCity("");
    setValue("idCity", "");
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    setValue("idCity", value);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "photo") {
        formData.append(key, value.toString());
      }
    });

    try {
      toast.promise(updateUserFn(formData, idUser), {
        loading: "Actualizando datos...",
        success: "Datos actualizados con éxito!",
        error: "Error al actualizar los datos",
      });
    } catch (error) {
      console.error("Error al actualizar el perfil", error);
      toast.error(
        "Error al actualizar el perfil: " +
          (axios.isAxiosError(error)
            ? error.response?.data?.message || "Error desconocido"
            : "Error desconocido"),
        {
          duration: 3000,
        }
      );
    }
  };

  if (isLoading) {
    return <Loading isLoading />;
  }

  return (
    <div className="flex justify-center w-full px-4 lg:px-0 m-2">
      <div className="w-full max-w-7xl bg-white rounded-xl">
        <div className=" p-6 shadow rounded-lg">
          {/* Header */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-semibold leading-tight">Mi Perfil</h2>
          </div>

          <div className="flex flex-col items-center text-center py-6">
            <ImageContainer user={user} />
            <h3 className="text-xl font-medium">
              {user?.name} {user?.lastname}
            </h3>
            <p className="text-gray-600">
              {user?.role ? user.role.join(" - ") : "No Roles"}
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center space-x-4">
            <p className="text-gray-600 text-xl font-medium mb-4">
              {user?.ranking.position}° - Categoría {user?.category.name}
            </p>
          </div>
        </div>

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
                    onStateChange={handleStateChange}
                  />
                </div>
                <div>
                  <Label htmlFor="city">Localidad</Label>
                  <CitySelect
                    idState={selectedState}
                    selected={selectedCity}
                    onCityChange={handleCityChange}
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
      </div>
    </div>
  );
}

export default Profile;
