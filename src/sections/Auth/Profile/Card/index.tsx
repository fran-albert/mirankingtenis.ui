"use client";

import { useState } from "react";
import { useUserMutations } from "@/hooks/Users/useUserMutation";
import { toast } from "sonner";
import axios from "axios";
import { OptimizedAvatar } from "@/components/ui/optimized-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Phone,
  Camera,
  Edit,
  Lock,
  Trophy,
  Save,
  X,
} from "lucide-react";
import { User as UserType } from "@/types/User/User";
import ImagePickerDialog from "@/components/Image-Picker/Dialog";
import { useAuth } from "@/context/AuthProvider";
import { TrophyList, TrophyHistoryModal } from "@/components/Trophy";
import { useUserTrophies, useUserTrophyCount } from "@/hooks/Trophy";
import { useTournamentsByUser } from "@/hooks/Tournament/useTournamentsByUser";

interface Props {
  user: UserType;
}

export default function PerfilPage({ user: usuario }: Props) {
  const { updateUserMutation, uploadPhotoMutation, changePasswordMutation } = useUserMutations();
  const { session } = useAuth();
  const { data: userTrophies = [], isLoading: trophiesLoading } = useUserTrophies(usuario.id);
  const { data: trophyCount = 0 } = useUserTrophyCount(usuario.id);
  const { data: tournamentCount = 0 } = useTournamentsByUser(usuario.id);

  const [editData, setEditData] = useState({ ...usuario });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isTrophyModalOpen, setIsTrophyModalOpen] = useState(false);

  const handleSaveData = async () => {
    try {
      const dataToSend = {
        name: editData.name,
        lastname: editData.lastname,
        email: editData.email,
        phone: editData.phone,
      };

      const userUpdatePromise = updateUserMutation.mutateAsync({
        user: dataToSend,
        id: usuario.id,
      });

      toast.promise(userUpdatePromise, {
        loading: "Guardando datos...",
        success: "Datos actualizados con éxito!",
        error: "Error al actualizar los datos",
      });

      await userUpdatePromise;
      setIsEditModalOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Error desconocido al actualizar los datos";
        toast.error(`Error: ${errorMessage}`, { duration: 3000 });
      } else {
        toast.error("Error al actualizar los datos", { duration: 3000 });
      }
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      const changePasswordPromise = changePasswordMutation.mutateAsync({
        userId: usuario.id,
        data: {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmNewPassword: passwordData.confirmPassword
        } as any
      });

      toast.promise(changePasswordPromise, {
        loading: "Cambiando contraseña...",
        success: "Contraseña cambiada exitosamente!",
        error: "Error al cambiar la contraseña",
      });

      await changePasswordPromise;
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsPasswordModalOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Error al cambiar la contraseña";
        toast.error(`Error: ${errorMessage}`, { duration: 3000 });
      }
    }
  };

  const handleChangeAvatar = async (imageBase64: string) => {
    try {
      // Convertir base64 a blob
      const response = await fetch(imageBase64);
      const blob = await response.blob();

      // Crear FormData con el archivo
      const formData = new FormData();
      formData.append(
        "photo",
        new File([blob], `${usuario.id}-avatar.jpeg`, {
          type: "image/jpeg",
        })
      );

      const uploadPromise = uploadPhotoMutation.mutateAsync({
        formData,
        idUser: usuario.id
      });

      toast.promise(uploadPromise, {
        loading: "Actualizando foto de perfil...",
        success: "Foto de perfil actualizada!",
        error: "Error al actualizar la foto",
      });

      const result = await uploadPromise;
      if (result) {
        const newPhotoUrl = result;
        // Actualizar localStorage directamente (se sincronizará en el siguiente login)
        localStorage.setItem('user_photo', newPhotoUrl);
        // Actualizar el estado local también
        setEditData((prev) => ({ ...prev, photo: newPhotoUrl }));
      }
    } catch (error) {
      console.error("Error al actualizar la foto:", error);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600">
            Gestiona tu información personal y configuración
          </p>
        </div>

        {/* Tarjeta principal del perfil */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-slate-800 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <OptimizedAvatar
                  src={editData.photo || usuario.photo}
                  alt={`${usuario.name} ${usuario.lastname}`}
                  size="large"
                  className="w-24 h-24 border-4 border-white shadow-lg"
                  fallbackText={`${usuario.name[0]}${usuario.lastname[0]}`}
                  priority
                />
                <ImagePickerDialog
                  onImageSelect={handleChangeAvatar}
                  onlyIcon
                />
              </div>

              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold">
                  {usuario.name} {usuario.lastname}
                </h2>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Información personal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  Información Personal
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Nombre completo</p>
                      <p className="font-medium">
                        {usuario.name} {usuario.lastname}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{usuario.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="font-medium">{usuario.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones rápidas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Acciones
                </h3>

                <div className="space-y-3">
                  <Dialog
                    open={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="w-full justify-start gap-3 h-12 bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        <Edit className="w-4 h-4" />
                        Editar Datos Personales
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Editar Datos Personales</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input
                              id="nombre"
                              value={editData.name}
                              onChange={(e) =>
                                setEditData((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="apellido">Apellido</Label>
                            <Input
                              id="apellido"
                              value={editData.lastname}
                              onChange={(e) =>
                                setEditData((prev) => ({
                                  ...prev,
                                  lastname: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editData.email}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="telefono">Teléfono</Label>
                          <Input
                            id="telefono"
                            value={editData.phone}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleSaveData} className="flex-1">
                            <Save className="w-4 h-4 mr-2" />
                            Guardar
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditModalOpen(false)}
                            className="flex-1"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <ImagePickerDialog onImageSelect={handleChangeAvatar} />

                  <Dialog
                    open={isPasswordModalOpen}
                    onOpenChange={setIsPasswordModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3 h-12 border-orange-200 hover:bg-orange-50 bg-transparent"
                        size="lg"
                      >
                        <Lock className="w-4 h-4" />
                        Cambiar Contraseña
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Cambiar Contraseña</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="currentPassword">
                            Contraseña Actual
                          </Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData((prev) => ({
                                ...prev,
                                currentPassword: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="newPassword">Nueva Contraseña</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData((prev) => ({
                                ...prev,
                                newPassword: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword">
                            Confirmar Nueva Contraseña
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={handleChangePassword}
                            className="flex-1"
                          >
                            <Lock className="w-4 h-4 mr-2" />
                            Cambiar
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsPasswordModalOpen(false)}
                            className="flex-1"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Separator className="my-4" />

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className="text-center p-4 bg-yellow-50 rounded-lg cursor-pointer transition-all hover:bg-yellow-100 hover:shadow-md"
                    onClick={() => setIsTrophyModalOpen(true)}
                  >
                    <p className="text-2xl font-bold text-yellow-600">{trophyCount}</p>
                    <p className="text-sm text-gray-600">Trofeos</p>
                    <p className="text-xs text-yellow-600 mt-1 opacity-75">
                      Click para ver historial
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{tournamentCount}</p>
                    <p className="text-sm text-gray-600">Torneos Jugados</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección de Trofeos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Mis Trofeos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trophiesLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
              </div>
            ) : (
              <TrophyList 
                trophies={userTrophies} 
                showStats={true}
              />
            )}
          </CardContent>
        </Card>

        {/* Configuración adicional */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Configuración de la Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-transparent"
              >
                <Trophy className="w-6 h-6" />
                <span>Historial de Torneos</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-transparent"
              >
                <User className="w-6 h-6" />
                <span>Preferencias</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              >
                <Lock className="w-6 h-6" />
                <span>Cerrar Sesión</span>
              </Button>
            </div>
          </CardContent>
        </Card> */}
      
      {/* Modal de historial de trofeos */}
      <TrophyHistoryModal
        open={isTrophyModalOpen}
        onOpenChange={setIsTrophyModalOpen}
        userId={usuario.id}
        userName={`${usuario.name} ${usuario.lastname}`}
      />
      </div>
    </div>
  );
}
