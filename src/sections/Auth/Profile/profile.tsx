import { useCustomSession } from "@/context/SessionAuthProviders";
import { getUser } from "@/modules/users/application/get/getUser";
import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import Loading from "@/components/Loading/loading";
import DataIndex from "./Data";

function Profile() {
  const { session } = useCustomSession();
  const idUser = session?.user.id as number;
  const [user, setUser] = useState<User>();
  const userRepository = createApiUserRepository();
  const loadUser = getUser(userRepository);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleEditPictureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchUser = async () => {
      try {
        const userData = await loadUser(idUser);
        setUser(userData);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [idUser]);

  if (isLoading) {
    return <Loading isLoading />;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.substr(0, 5) === "image") {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setSelectedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.log("Not an image file.");
    }
  };
  return (
    <div className="flex justify-center w-full px-4 lg:px-0 m-2">
      <div className="w-full max-w-7xl bg-white rounded-xl">
        <div className=" p-6 shadow rounded-lg">
          {/* Header */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-semibold leading-tight">Mi Perfil</h2>
          </div>

          <div className="flex flex-col items-center text-center py-6">
            <div className="relative mb-3">
              {/* Image Container */}
              <div className="group rounded-2xl overflow-hidden">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Profile Picture"
                    className="rounded-2xl"
                    style={{ width: "100px", height: "100px" }}
                  />
                ) : (
                  <Image
                    src={
                      session?.user?.photo
                        ? `https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${session.user.photo}.jpeg`
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
            <h3 className="text-xl font-medium">
              {user?.name} {user?.lastname}
            </h3>
            <p className="text-gray-600">
              {user?.role ? user.role.join(" - ") : "No Roles"}
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center space-x-4">
            <p className="text-gray-600 text-xl font-medium mb-4">
              {user?.ranking.position}° - Categoría {user?.category.name}
            </p>
          </div>

          <DataIndex user={user} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
