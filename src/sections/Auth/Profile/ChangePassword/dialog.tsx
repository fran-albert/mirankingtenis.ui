"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ActionIcon from "@/components/ui/actionIcon";
import { FaTrashAlt } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/passwordInput";
import { useUserMutations } from "@/hooks/Users/useUserMutation";
import { User } from "@/types/User/User";
import { toast } from "sonner";
import axios from "axios";
import { Lock } from "lucide-react";

interface ChangePasswordDialogProps {
  id: number;
}

export default function ChangePasswordDialog({
  id,
}: ChangePasswordDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
    control,
  } = useForm<User>();
  const toggleDialog = () => setIsOpen(!isOpen);
  const { changePasswordMutation } = useUserMutations();

  const handleChangePassword = async (data: User) => {
    const dataToSend: any = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmNewPassword: data.confirmNewPassword,
    };

    try {
      const response = await changePasswordMutation.mutateAsync({
        userId: id,
        data: dataToSend
      });
      if (response) {
        toast.success("Contraseña cambiada correctamente");
        toggleDialog();
        clearErrors();
        reset();
      }
    } catch (error) {
      clearErrors();
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Error desconocido al cambiar la contraseña";
        toast.error(`Error al cambiar la contraseña: ${errorMessage}`, {
          duration: 1000,
        });
        console.error("Error al enviar los datos:", errorMessage);
      }
    }
  };

  const onSubmit = handleSubmit((dataToSend) => {
    handleChangePassword(dataToSend);
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={toggleDialog} className="bg-slate-800">
          <Lock className="w-5 h-5 mr-2" />
          Cambiar Contraseña
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cambiar contraseña</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <form
            className="flex flex-col gap-6 mx-auto p-8 "
            onSubmit={onSubmit}
          >
            {/* Contraseña Actual */}
            <div>
              <Label htmlFor="currentPassword">Contraseña Actual</Label>
              <Controller
                name="currentPassword"
                control={control}
                render={({ field }) => <PasswordInput {...field} />}
              />
            </div>

            {/* Nueva Contraseña */}
            <div>
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => <PasswordInput {...field} />}
              />
            </div>

            {/* Confirmar Nueva Contraseña */}
            <div>
              <Label htmlFor="confirmNewPassword">
                Confirmar Nueva Contraseña
              </Label>
              <Controller
                name="confirmNewPassword"
                control={control}
                render={({ field }) => <PasswordInput {...field} />}
              />
            </div>

            {/* Botones */}
            <DialogFooter className="flex justify-end gap-4 mt-4">
              <Button variant="outline" type="button" onClick={toggleDialog}>
                Cancelar
              </Button>
              <Button variant="default" type="submit">
                Confirmar
              </Button>
            </DialogFooter>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
