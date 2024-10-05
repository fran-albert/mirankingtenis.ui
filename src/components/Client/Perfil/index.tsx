"use client";
import Profile from "@/sections/Auth/Profile/profile";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Edit2, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StateSelect } from "@/components/Select/State/select";
import { CitySelect } from "@/components/Select/City/select";
import ImageContainer from "@/sections/Auth/Profile/Image-Container";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { useUser } from "@/hooks/Users/useUser";
import { State } from "@/types/State/State";
import { City } from "@/types/City/City";
import { toast } from "sonner";
import useUserStore from "@/context/UserContext";
import axios from "axios";
import { useUserMutations } from "@/hooks/Users/useUserMutation";
import Loading from "@/components/Loading/loading";
import ChangePasswordDialog from "@/sections/Auth/Profile/ChangePassword/dialog";

// type FormValues = z.infer<typeof userSchema>;
type FormValues = any;

export default function ClientProfilePage() {
  const { session } = useCustomSession();
  const idUser = session?.user.id as number;
  const form = useForm<FormValues>({
    // resolver: zodResolver(userSchema),
  });
  const { user, isLoading, error } = useUser({
    auth: true,
    id: idUser,
  });
  console.log(user);
  const { setValue, control } = form;
  const [selectedState, setSelectedState] = useState<State | undefined>(
    user?.state
  );
  const [selectedCity, setSelectedCity] = useState<City | undefined>(
    user?.city
  );

  useEffect(() => {
    if (user) {
      console.log("Datos del usuario cargados:", user);

      setValue("name", user.name);
      setValue("lastname", user.lastname);
      setValue("email", user.email);
      setValue("phone", user.phone);
      // setValue("gender", String(user.gender) || "");
      setValue("idCity", user.city?.id || ""); // Actualizar idCity con el ID de la ciudad

      // Asegurarnos de que el estado seleccionado también se actualice
      if (user.state) {
        console.log("Estado seleccionado:", user.state); // Log para el estado seleccionado
        setSelectedState(user.state);
      }
    }
  }, [user, setValue]);

  useEffect(() => {
    if (user) {
      setValue("idCity", user.city?.id || "");
      if (user.city) {
        setSelectedCity(user.city); // Aseguramos que la ciudad seleccionada se cargue
      }
    }
  }, [user, setValue]);

  useEffect(() => {
    if (user && user.city) {
      setSelectedCity(user.city); // Aseguramos que la ciudad seleccionada se cargue
    }
  }, [user]);

  const { updateUserMutation } = useUserMutations();
  const [isEditing, setIsEditing] = useState(false);
  const handleSave = async () => {
    const dataToSend: any = {
      name: form.getValues("name"),
      lastname: form.getValues("lastname"),
      email: form.getValues("email"),
      phone: form.getValues("phone"),
      idCity: String(selectedCity?.id),
    };

    try {
      const userCreationPromise = updateUserMutation.mutateAsync({
        user: dataToSend,
        id: idUser,
      });

      toast.promise(userCreationPromise, {
        loading: "Guardando datos...",
        success: "Datos actualizados con éxito!",
        error: "Error al actualizar los datos",
      });
      setIsEditing(false);
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

  const handleStateChange = (state: State) => {
    setSelectedState(state);
  };

  const handleCityChange = (city: City) => {
    if (city) {
      console.log("Ciudad cambiada:", city); // Log para ver la ciudad seleccionada
      setSelectedCity(city); // Actualizamos el estado con la ciudad seleccionada
      setValue("idCity", city.id, { shouldValidate: true }); // Actualizamos el valor en el formulario
    }
  };

  if (isLoading || !user) {
    return <Loading isLoading />;
  }

  return (
    <>
      <div key="1" className="container w-full mt-4">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} id="profileForm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  <p className="flex items-center justify-start w-full text-greenPrimary font-bold">
                    Mi Perfil
                  </p>
                </CardTitle>
                {!isEditing ? (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-slate-800 hover:shadow-xl hover:bg-slate-700"
                      type="button"
                    >
                      <Edit2 className="mr-2 h-4 w-4" /> Editar
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleSave}
                      type="button"
                      className="bg-slate-800 hover:shadow-xl hover:bg-slate-700"
                    >
                      <Save className="mr-2 h-4 w-4" /> Guardar
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardHeader>

              <div className="flex flex-col items-center text-center py-6">
                {user && <ImageContainer user={user} />}
                <h3 className="text-xl font-medium">
                  {user?.name} {user?.lastname}
                </h3>
                <p className="text-gray-600">
                  {user?.role ? user.role.join(" - ") : "No Roles"}
                </p>
              </div>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black flex items-center justify-between">
                              Nombre
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                defaultValue={user?.name}
                                placeholder="Ingresar nombre..."
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="lastname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black flex items-center justify-between">
                              Apellido
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Ingresar apellido..."
                                disabled={!isEditing}
                                defaultValue={user?.lastname}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black flex items-center justify-between">
                              Correo Electrónico
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Ingresar correo electrónico..."
                                defaultValue={user?.email}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black flex items-center justify-between">
                              Teléfono
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Ingresar teléfono..."
                                defaultValue={user?.phone}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black flex items-center justify-between">
                              Sexo
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                defaultValue={
                                  user?.gender === "male"
                                    ? "Masculino"
                                    : "Femenino"
                                }
                                disabled={true}
                                placeholder="Ingresar teléfono..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  {/* <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name=""
                        render={({}) => (
                          <FormItem>
                            <FormLabel className="text-black flex items-center justify-between">
                              Provincia
                            </FormLabel>
                            <FormControl>
                              <StateSelect
                                control={control}
                                disabled={!isEditing}
                                defaultValue={user?.state}
                                onStateChange={handleStateChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="idCity"
                        render={({}) => (
                          <FormItem>
                            <FormLabel className="text-black flex items-center justify-between">
                              Ciudad
                            </FormLabel>
                            <FormControl>
                              <CitySelect
                                control={control}
                                disabled={!isEditing}
                                defaultValue={user?.city}
                                idState={selectedState ? selectedState.id : 0}
                                onCityChange={handleCityChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div> 
                  </div>*/}
                </div>
              </CardContent>
            </form>
          </Form>
          <div className="flex justify-center m-4">
            <ChangePasswordDialog id={user.id} />
          </div>
        </Card>
      </div>
    </>
  );
}
