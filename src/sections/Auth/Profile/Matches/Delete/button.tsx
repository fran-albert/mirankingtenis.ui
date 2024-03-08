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
import ActionIcon from "@/components/ui/actionIcon";
import { FaTrashAlt } from "react-icons/fa";

interface DeleteMatchDialogProps {
  match: any;
  onDeleteMatch?: () => void;
}

export default function DeleteMatchDialog({
  onDeleteMatch,
}: DeleteMatchDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDialog = () => setIsOpen(!isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={toggleDialog} variant="outline" size="icon">
          <ActionIcon
            icon={
              <FaTrashAlt
                size={25}
                className="text-red-500 hover:text-red-700"
              />
            }
            tooltip="Eliminar"
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar Partido</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          ¿Estás seguro de que quieres eliminar este partido?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={toggleDialog}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onDeleteMatch}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
