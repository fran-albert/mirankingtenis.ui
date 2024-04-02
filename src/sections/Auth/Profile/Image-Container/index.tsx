import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { FaPencilAlt } from "react-icons/fa";
import Loading from "@/components/Loading/loading";
import Image from "next/image";
import { toast } from "sonner";
import { updatePhoto } from "@/modules/users/application/update-photo/updatePhoto";
import { useProfilePhoto } from "@/context/ProfilePhotoContext";

function ImageContainer({ user }: { user: User | undefined }) {
  const userRepository = createApiUserRepository();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { updateProfilePhoto } = useProfilePhoto();
  const updatePhotoFn = updatePhoto(userRepository);
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
    const photoData = new FormData();
    photoData.append("photo", file);
    try {
      setIsLoading(true);
      const response = await updatePhotoFn(photoData, user?.id as number);
      if (response) {
        const newPhotoUrl = `https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${response}.jpeg`;
        setSelectedImage(newPhotoUrl);
        updateProfilePhoto(newPhotoUrl);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Error al actualizar la foto");
      console.error("Error updating photo: ", error);
      setIsLoading(false);
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
            width={100} // Estos valores determinan el tamaño de la imagen y ayudan con la optimización
            height={100}
            className="rounded-2xl"
          />
        ) : (
          <Image
            src={
              user?.photo
                ? `https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${user.photo}.jpeg`
                : "https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/default2.png"
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
            className="bg-gray-500 p-2 rounded-full cursor-pointer"
            onClick={handleEditPictureClick}
          >
            <FaPencilAlt className="text-white" />
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
    </div>
  );
}

export default ImageContainer;
