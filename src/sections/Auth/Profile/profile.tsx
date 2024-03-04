import { useCustomSession } from "@/context/SessionAuthProviders";
import { getUser } from "@/modules/users/application/get/getUser";
import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import MatchesIndex from "./Matches";
import { Match } from "@/modules/match/domain/Match";
import { createApiMatchRepository } from "@/modules/match/infra/ApiMatchRepository";
import { getMatchesByUser } from "@/modules/match/application/get-by-user/getMatchesByUser";
import Loading from "@/components/Loading/loading";

function Profile() {
  const { session } = useCustomSession();
  const idUser = session?.user.id as number;
  const [user, setUser] = useState<User>();
  const userRepository = createApiUserRepository();
  const [matches, setMatches] = useState<Match[]>([]);
  const matchRepository = createApiMatchRepository();
  const loadMatches = getMatchesByUser(matchRepository);
  const loadUser = getUser(userRepository);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("MisDatos");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Función para cambiar la pestaña activa
  const changeTab = (tab: any) => {
    setActiveTab(tab);
  };

  const handleEditPictureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchUserAndMatches = async () => {
      try {
        const userData = await loadUser(idUser);
        setUser(userData);
        const userMatches = await loadMatches(idUser);
        setMatches(userMatches);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserAndMatches();
  }, [idUser]);

  console.log(matches, idUser);

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
                    src={`https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${user?.photo}.jpeg`}
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

          {/* Profile Navigation */}
          <div className="flex justify-around text-sm font-medium text-gray-600 border-t border-b py-3">
            <a
              onClick={() => changeTab("MisDatos")}
              className={`hover:text-blue-600 cursor-pointer ${
                activeTab === "MisDatos" ? "text-blue-600" : ""
              }`}
            >
              Mis Datos
            </a>
            <a
              onClick={() => changeTab("MisPartidos")}
              className={`hover:text-blue-600 cursor-pointer ${
                activeTab === "MisPartidos" ? "text-blue-600" : ""
              }`}
            >
              Mis Partidos
            </a>
            <a
              onClick={() => changeTab("MisEstadisticas")}
              className={`hover:text-blue-600 cursor-pointer ${
                activeTab === "MisEstadisticas" ? "text-blue-600" : ""
              }`}
            >
              Mis Estadísticas
            </a>
          </div>

          {/* About Me & Social Links */}
          {activeTab === "MisDatos" && (
            <div>{/* Contenido de Mis Datos */}</div>
          )}
          {activeTab === "MisPartidos" && <MatchesIndex match={matches} />}
          {activeTab === "MisEstadisticas" && (
            <div>{/* Contenido de Mis Estadísticas */}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
