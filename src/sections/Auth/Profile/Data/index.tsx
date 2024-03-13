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
  const [selectedState, setSelectedState] = useState(
    user?.city.idState.toString()
  );
  const [selectedCity, setSelectedCity] = useState(user?.city.id.toString());
  const [selectedCategory, setSelectedCategory] = useState(
    user?.category.id.toString()
  );
  const userRepository = createApiUserRepository();
  const createUserFn = createUser(userRepository);

  console.log(user);

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
  return <></>;
}

export default DataIndex;
