"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdLockReset } from "react-icons/md";
import { GenderSelect } from "@/components/Select/Gender/select";
import ImagePickerDialog from "@/components/Image-Picker/Dialog";
import { useUser } from "@/hooks/Users/useUser";
import { useUserMutations } from "@/hooks/Users/useUserMutation";
import Loading from "@/components/Loading/loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Schema extendido para el formulario de admin
const AdminUserSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  lastname: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "El teléfono es obligatorio"),
  gender: z.string().min(1, "El género es obligatorio"),
});

type FormValues = z.infer<typeof AdminUserSchema>;

interface EditPlayerAdminFormProps {
  playerId: number;
}

// Helper function para mostrar género en español
const getGenderLabel = (gender: string) => {
  const genderMap: { [key: string]: string } = {
    male: "Masculino",
    female: "Femenino",
  };
  return genderMap[gender] || gender;
};

export function EditPlayerAdminForm({ playerId }: EditPlayerAdminFormProps) {
  const router = useRouter();
  const { user, isLoading } = useUser({
    id: playerId,
    auth: true,
  });
  const { updateUserMutation, resetPasswordMutation, uploadPhotoMutation } = useUserMutations();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(AdminUserSchema),
  });

  const { setValue, control, reset } = form;

  // Cargar datos del usuario cuando se obtengan
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
      });

      setSelectedImage(user.photo || null);
    }
  }, [user, reset]);


  const handleImageSelect = async (imageUrl: string) => {
    try {
      // Convertir base64 a File
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "profile-image.jpg", { type: "image/jpeg" });

      // Crear FormData
      const formData = new FormData();
      formData.append("photo", file);

      // Subir la imagen
      await toast.promise(
        uploadPhotoMutation.mutateAsync({ formData, idUser: playerId }),
        {
          loading: "Subiendo imagen...",
          success: "Imagen actualizada con éxito",
          error: "Error al actualizar la imagen",
        }
      );

      // Actualizar la vista previa
      setSelectedImage(imageUrl);
    } catch (error) {
      console.error("Error al procesar la imagen:", error);
      toast.error("Error al procesar la imagen");
    }
  };

  const onSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
    };

    try {
      await toast.promise(
        updateUserMutation.mutateAsync({ user: payload, id: playerId }),
        {
          loading: "Actualizando jugador...",
          success: "Jugador actualizado con éxito!",
          error: "Error al actualizar el jugador",
        }
      );
    } catch (error) {
      console.error("Error al actualizar jugador:", error);
    }
  };

  const handleResetPassword = async () => {
    setIsResettingPassword(true);
    try {
      const response = await resetPasswordMutation.mutateAsync(playerId);
      toast.success(
        response.newPassword
          ? `Contraseña restablecida. Nueva contraseña: ${response.newPassword}`
          : "Contraseña restablecida con éxito"
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al restablecer la contraseña";
      toast.error(errorMessage);
      console.error("Error:", error);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleGoBack = () => {
    router.push("/admin/jugadores");
  };

  if (isLoading) {
    return <Loading isLoading={true} />;
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Jugador no encontrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón de volver */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleGoBack}
          className="flex items-center gap-2"
        >
          <IoMdArrowRoundBack className="h-4 w-4" />
          Volver
        </Button>
        <div>
          <h2 className="text-2xl font-bold">
            {user.name} {user.lastname}
          </h2>
          <p className="text-gray-600">ID: {user.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información del jugador y foto */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Información del Jugador</CardTitle>
            <CardDescription>Foto de perfil y datos básicos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar y cambio de foto */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={selectedImage || ""}
                  alt={`${user.name} ${user.lastname}`}
                />
                <AvatarFallback>
                  {user.name?.charAt(0)}
                  {user.lastname?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <ImagePickerDialog onImageSelect={handleImageSelect} />
            </div>

            <Separator />

            {/* Información básica */}
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Email:</span> {user.email}
              </div>
              <div>
                <span className="font-medium">Teléfono:</span> {user.phone}
              </div>
              <div>
                <span className="font-medium">Género:</span> {getGenderLabel(user.gender)}
              </div>
              {user.city && (
                <div>
                  <span className="font-medium">Ciudad:</span> {user.city.city}
                </div>
              )}
              {user.category && (
                <div>
                  <span className="font-medium">Categoría:</span> {user.category.name}
                </div>
              )}
            </div>

            <Separator />

            {/* Botón de restablecer contraseña */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full"
                  disabled={isResettingPassword}
                >
                  <MdLockReset className="h-4 w-4 mr-2" />
                  Restablecer Contraseña
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Restablecer Contraseña</DialogTitle>
                  <DialogDescription>
                    ¿Estás seguro de que quieres restablecer la contraseña de{" "}
                    {user.name} {user.lastname}? Se generará una nueva
                    contraseña temporal.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button
                    onClick={handleResetPassword}
                    variant="destructive"
                    disabled={isResettingPassword}
                  >
                    {isResettingPassword ? "Restableciendo..." : "Restablecer"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Formulario de edición */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Editar Información</CardTitle>
            <CardDescription>Modifica los datos del jugador</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                {/* Nombre y Apellido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido *</FormLabel>
                        <FormControl>
                          <Input placeholder="Apellido" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email y DNI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="email@ejemplo.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Teléfono y Género */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="+54 11 1234-5678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Género *</FormLabel>
                        <FormControl>
                          <GenderSelect
                            control={control}
                            defaultValue={user?.gender}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

              </CardContent>

              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleGoBack}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateUserMutation.isPending}>
                  {updateUserMutation.isPending
                    ? "Guardando..."
                    : "Guardar Cambios"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
