"use client";
import { CategorySelect } from "@/components/Select/Category/select";
import { CitySelect } from "@/components/Select/City/select";
import { StateSelect } from "@/components/Select/State/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { goBack } from "@/lib/utils";
import { createUser } from "@/modules/users/application/create/createUser";
import { User } from "@/types/User/User";
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
import { GenderSelect } from "@/components/Select/Gender/select";
import { UserSchema } from "@/validators/user.schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserMutations } from "@/hooks/Users/useUserMutation";
import { State } from "@/types/State/State";
import { City } from "@/types/City/City";
import ImagePickerDialog from "@/components/Image-Picker/Dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type FormValues = z.infer<typeof UserSchema>;

function CreatePlayerForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(UserSchema),
  });
  const { setValue, control } = form;
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { addUserMutation } = useUserMutations();

  async function onSubmit(data: z.infer<typeof UserSchema>) {
    const payload: any = {
      ...data,
      photo: selectedImage,
    };
    try {
      const playerCreationPromise = addUserMutation.mutateAsync(payload);
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
  }

  const handleStateChange = (state: State) => {
    setSelectedState(state);
  };

  const handleCityChange = (city: City) => {
    if (selectedState) {
      setSelectedCity(city);
      setValue("idCity", String(city.id));
    }
  };

  const handleImageSelect = (image: string) => {
    setSelectedImage(image);
  };

  return (
    <>
      <div key="1" className="w-full">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <div className="col-span-2 flex flex-col items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          alt="Player Avatar"
                          src={selectedImage || "/placeholder-avatar.jpg"}
                        />
                        <AvatarFallback>JP</AvatarFallback>
                      </Avatar>
                      <ImagePickerDialog onImageSelect={handleImageSelect} onlyIcon />
                    </div>
                  </div>
                  {/* <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                
              </div> */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black">Nombre</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Ingresar nombre..."
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
                            <FormLabel className="text-black">
                              Apellido
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Ingresar apellido..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black">
                              Correo Electrónico
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Ingresar correo electrónico..."
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
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-black">
                              Teléfono
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Ingresar teléfono..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Sexo</Label>
                      <GenderSelect control={control} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="state">Provincia</Label>
                      <StateSelect
                        control={control}
                        onStateChange={handleStateChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Localidad</Label>
                      <CitySelect
                        control={control}
                        idState={selectedState ? Number(selectedState.id) : 0}
                        onCityChange={handleCityChange}
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
          </Form>
        </Card>
      </div>
    </>
  );
}

export default CreatePlayerForm;
