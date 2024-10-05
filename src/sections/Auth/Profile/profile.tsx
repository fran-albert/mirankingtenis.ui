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
}

export default Profile;
