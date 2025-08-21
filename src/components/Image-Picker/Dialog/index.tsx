// ImagePickerDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImagePicker from "..";
import { Camera } from "lucide-react";

interface ImagePickerDialogProps {
  onImageSelect: (image: string) => void;
  onlyIcon?: boolean;
}

const ImagePickerDialog: React.FC<ImagePickerDialogProps> = ({
  onImageSelect,
  onlyIcon,
}) => {
  const [open, setOpen] = useState(false);

  const handleImageSelect = (image: string) => {
    onImageSelect(image);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {onlyIcon ? (
          <Button
            variant="outline"
            size="sm"
            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-white text-green-600 hover:bg-gray-100"
          >
            <Camera className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12 border-blue-200 hover:bg-blue-50 bg-transparent"
            size="lg"
          >
            <Camera className="w-4 h-4" />
            Cambiar Foto de Perfil
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Seleccionar Imagen</DialogTitle>
          <DialogDescription>
            Elige una imagen para subir o captura una desde la cámara.
          </DialogDescription>
        </DialogHeader>
        <ImagePicker onImageSelect={handleImageSelect} />
      </DialogContent>
    </Dialog>
  );
};

export default ImagePickerDialog;
