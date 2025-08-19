import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import React, { useRef, useState, useCallback } from "react";
import { FaCamera, FaPencilAlt } from "react-icons/fa";
import Loading from "@/components/Loading/loading";
import Image from "next/image";
import { toast } from "sonner";
import { updatePhoto } from "@/modules/users/application/update-photo/updatePhoto";
import { useProfilePhoto } from "@/context/ProfilePhotoContext";
import { User } from "@/types/User/User";
import Cropper, { Area } from "react-easy-crop";
import getCroppedImg from "./cropped"; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogOverlay,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const validarTamañoImagen = (file: any) => {
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    return false;
  }
  return true;
};

function ImageContainer({ user }: { user: User }) {
  const userRepository = createApiUserRepository();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openCrop, setOpenCrop] = useState<boolean>(false); 
  const { updateProfilePhoto } = useProfilePhoto();
  const updatePhotoFn = updatePhoto(userRepository);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleEditPictureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected.");
      return;
    }

    if (!validarTamañoImagen(file)) {
      toast.error(
        "El archivo es demasiado grande. El tamaño máximo permitido es de 2MB."
      );
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageSrc(reader.result as string); 
      setOpenCrop(true);
    };
    
    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    event.target.value = '';
  };

  const resetCropState = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleConfirmCrop = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsLoading(true);
      const croppedImage = await getCroppedImg(imageSrc!, croppedAreaPixels); 
      const formData = new FormData();
      formData.append(
        "photo",
        new File([croppedImage], `${user.id}-avatar.jpeg`, {
          type: "image/jpeg",
        })
      );

      const response = await updatePhotoFn(formData, user?.id as number);
      if (response) {
        const newPhotoUrl = `https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${response}.jpeg`;
        setSelectedImage(newPhotoUrl);
        updateProfilePhoto(newPhotoUrl);
      }
    } catch (error) {
      toast.error("Error al actualizar la foto");
      console.error("Error updating photo: ", error);
    } finally {
      setIsLoading(false);
      setOpenCrop(false);
      resetCropState(); // Limpiar estados después de confirmar
    }
  };

  return (
    <div className="relative mb-3">
      {/* Image Container */}
      <div className="group rounded-2xl overflow-hidden">
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt="Profile Picture"
            width={100}
            height={100}
            className="rounded-2xl"
          />
        ) : (
          <Image
            src={
              user?.photo
                ? `https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${user.photo}.jpeg`
                : "https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/mirankingtenis_default.png"
            }
            alt="Profile Picture"
            width={100}
            height={100}
            className="rounded-2xl"
          />
        )}

        {/* Edit Icon Container */}
        <div className="absolute bottom-0 right-0 mb-2 mr-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
          <div
            className="bg-gray-900 p-2 rounded-full cursor-pointer"
            onClick={handleEditPictureClick}
          >
            <FaCamera className="text-white" />
          </div>
        </div>
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Modal de recorte */}
      {openCrop && (
        <Dialog open={openCrop} onOpenChange={(open) => {
          if (!open) {
            resetCropState(); // Limpiar estados cuando se cierra el modal
          }
          setOpenCrop(open);
        }}>
          <DialogOverlay />
          <DialogContent>
            {/* Header del modal */}
            <DialogHeader>
              <DialogTitle>Recortar imagen</DialogTitle>
              <DialogDescription>
                Ajusta el recorte de la imagen como desees antes de confirmar.
              </DialogDescription>
            </DialogHeader>

            {/* Contenido del recorte */}
            <div className="relative w-full h-[400px]">
              {imageSrc && (
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1} 
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              )}
            </div>

            {/* Footer con acciones */}
            <DialogFooter className="flex justify-center space-x-2">
              <Button
                className="bg-slate-700 text-white rounded-md"
                onClick={handleConfirmCrop}
              >
                Confirmar recorte
              </Button>
              <Button
                className="mb-4 rounded-md"
                variant={"outline"}
                onClick={() => {
                  resetCropState(); // Limpiar estados al cancelar
                  setOpenCrop(false);
                }}
              >
                Cancelar
              </Button>
            </DialogFooter>

            {/* Botón de cierre en la parte superior */}
            <DialogClose className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <span aria-hidden="true">×</span>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default ImageContainer;
