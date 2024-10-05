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
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import { changePassword } from "@/modules/users/application/change-password/changePassword";
import { User } from "@/types/User/User";
import { toast } from "sonner";
import axios from "axios";
import { resetUserPassword } from "@/modules/users/application/default-password/defaultPassword";

interface DefaultPasswordDialogProps {
  id: number;
}

export default function DefaultPasswordDialog({
  id,
}: DefaultPasswordDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { handleSubmit } = useForm<User>();
  const toggleDialog = () => setIsOpen(!isOpen);
  const userRepository = createApiUserRepository();
  const defaultPasswordFn = resetUserPassword(userRepository);

  const handleChangePassword = async (data: User) => {
    try {
      const response = await defaultPasswordFn(id);
      if (response) {
        toast.success("Contraseña restablecida correctamente");
        toggleDialog();
      }
    } catch (error) {
      console.log("Error al resetear la contraseña", error);
      toast.error("Error al resetear la contraseña");
    }
  };

  const onSubmit = handleSubmit((dataToSend) => {
    handleChangePassword(dataToSend);
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="text-gray-600  font-medium"
          onClick={toggleDialog}
          variant="outline"
        >
          Resetear Contraseña
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-lg p-4">
        <DialogHeader>
          <DialogTitle>Resetear contraseña</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <form
            className="flex flex-col gap-6 mx-auto p-8 "
            onSubmit={onSubmit}
          >
            <p className="font-bold text-gray-800">
              Está seguro que desea resetear la contraseña del jugador? Su nueva
              contraseña será 12345678
            </p>
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
