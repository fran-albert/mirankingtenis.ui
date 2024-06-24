import { useCustomSession } from "@/context/SessionAuthProviders";
import { User } from "@/modules/users/domain/User";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Loading from "@/components/Loading/loading";
import { Button } from "@/components/ui/button";
import { CitySelect } from "@/components/Select/City/select";
import { StateSelect } from "@/components/Select/State/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { goBack } from "@/lib/utils";
import axios from "axios";
import { useForm, SubmitHandler, set } from "react-hook-form";
import { toast } from "sonner";
import ImageContainer from "./Image-Container";
import ChangePasswordDialog from "./ChangePassword/dialog";
import useUserStore from "@/context/UserContext";

interface Inputs extends User {}

function Profile() {
  const { session } = useCustomSession();
  const idUser = session?.user.id as number;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Inputs>();
  const [selectedState, setSelectedState] = useState(0);
  const [selectedCity, setSelectedCity] = useState(0);
  const { user, loadUser, updateUser } = useUserStore();

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user.id) {
        setIsLoading(true);
        try {
          await loadUser(session.user.id);
          setSelectedState(Number(user?.city.idState));
          setSelectedCity(Number(user?.city.id));
        } catch (error) {
          console.error("Error cargando el usuario:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [session?.user.id, loadUser, user?.city.idState, user?.city.id]);

  if (isLoading) {
    return <Loading isLoading />;
  }

  // const handleStateChange = (selectedState: State | undefined) => {
  //   console.log("Seleccionando provincia:", selectedState);
  //   if (!selectedState) {
  //     setSelectedCity(undefined);
  //     setValue("idCity", "");
  //   } else {
  //     setValue("idCity", selectedState.id.toString());
  //     setSelectedCity(undefined);
  //     // Posiblemente necesites reiniciar el valor de selectedCity aquí para reflejar el cambio en el UI
  //   }
  // };

  // const handleCityChange = (selectedCity: string | undefined) => {
  //   console.log("Seleccionando localidad:", selectedCity);
  //   if (selectedCity) {
  //     setValue("idCity", selectedCity);
  //   }
  // };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const dataToSend = {
      ...data,
      idCity: data.idCity,
    };

    try {
      await updateUser(idUser, dataToSend);
      await loadUser(idUser);
      toast.success("Datos actualizados con éxito!", { duration: 3000 });
      goBack();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Error desconocido al crear el jugador";
        toast.error(`Error al actualizar los datos: ${errorMessage}`, {
          duration: 3000,
        });
        console.error("Error al actualizar los datos", errorMessage);
      } else {
        toast.error("Error al actualizar los datos: Error desconocido", {
          duration: 3000,
        });
        console.error("Error al actualizar los datos", error);
      }
    }
  };

  return (
    <div className="flex justify-center w-full px-4 lg:px-0 m-2">
      <div className="w-full max-w-7xl bg-white">
        <div className="p-6">
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
              {/* {user?.ranking.position}° - Categoría {user?.category.name} */}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center p-4 ">
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

                <div className="md:flex md:gap-4">
                  <div className="flex-1">
                    {/* <Label htmlFor="category">Categoría</Label> */}
                    {/* <Input
                      className="w-full bg-gray-200 border-gray-300 text-gray-800 cursor-not-allowed"
                      defaultValue={user?.category.name}
                      readOnly
                    /> */}
                  </div>
                  {/* <div className="flex-1">
                    <Label htmlFor="category">Ranking Inicial</Label>
                    <Input
                      className="w-full bg-gray-200 border-gray-300 text-gray-800 cursor-not-allowed"
                      defaultValue={user?.historyRankings[0].position + "°"}
                      readOnly
                    />
                  </div> */}
                </div>

                <div>
                  <Label htmlFor="state">Provincia</Label>
                  <StateSelect
                    selected={Number(selectedState)}
                    onStateChange={setSelectedState}
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ciudad</Label>
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
              <div className="mt-4">
                <Label htmlFor="userName">Correo Electrónico</Label>
                <Input
                  className="w-full bg-gray-200 border-gray-300 text-gray-800"
                  {...register("email")}
                  defaultValue={user?.email}
                />
              </div>
            </form>
            <div className="flex justify-center gap-4 mt-10">
              <Button
                className="w-full sm:w-auto"
                variant="outline"
                type="button"
                onClick={handleSubmit(onSubmit)}
              >
                Modificar Datos
              </Button>
              <ChangePasswordDialog id={idUser} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
