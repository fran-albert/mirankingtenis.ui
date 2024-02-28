import { useCustomSession } from "@/context/SessionAuthProviders";
import { getUser } from "@/modules/users/application/get/getUser";
import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function ProfilePlayer() {
  const params = useParams();
  const id = params.id;
  const [player, setPlayer] = useState<User>();

  const userRepository = createApiUserRepository();
  const loadUser = getUser(userRepository);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const idUser = Number(id);
        const userData = await loadUser(idUser);
        setPlayer(userData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <main className="container mx-auto px-4 py-12 text-gray-200 bg-slate-700 m-8 shadow-lg rounded-xl">
        <div className="flex flex-col md:flex-row justify-center items-end">
          <div className="md:flex-1">
            <h1 className="text-3xl font-bold text-center md:text-left">
              {player?.name} {player?.lastname}
            </h1>
            <div className="mt-6 md:mt-0">
              <div className="text-center md:text-left">
                <h2 className="text-lg font-semibold">Este Año</h2>
                <p>Ranking: VER POSICION DEL RANKING..</p>
                <p>
                  G-P: {player?.ranking.wonMatches}-
                  {player?.ranking.lostMatches}
                </p>
                <p>Categoría: {player?.category.name}</p>
              </div>
              <div className="text-center md:text-left mt-4">
                <h2 className="text-lg font-semibold">Carrera</h2>
                <p>Mejor Ranking (2023.06.19): 19</p>
                <p>W-L: 69-64</p>
                <p>Títulos: 2</p>
              </div>
            </div>
          </div>
          <div className="md:flex-1 flex justify-center md:justify-end">
            <img
              src="https://r.testifier.nl/Acbs8526SDKI/resizing_type:fill/watermark:Picture%3A+Proshots/width:742/height:495/plain/https%3A%2F%2Fs3-newsifier.ams3.digitaloceanspaces.com%2Ftennisuptodate.com%2Fimages%2F2021-05%2Ffederer-genova-2021-2-60a38f0823b60.jpg"
              alt="Player"
              className="w-3/4 md:w-full max-w-md rounded-lg shadow-lg"
            />
          </div>
        </div>
        <h3 className="text-lg mb-2 mt-10 font-semibold border-b pb-2">
          Detalles personales
        </h3>
        <div className="md:grid md:grid-cols-2 md:gap-4">
          <div className="mb-4">
            <div className="flex justify-between">
              <span className="font-semibold">Edad</span>
              <span>25 (1998.08.13)</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Peso</span>
              <span>176 lbs (80kg)</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Estatura</span>
              <span>6'1" (185cm)</span>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between">
              <span className="font-semibold">País</span>
              <span>Argentina</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Mano</span>
              <span>Diestro, Dos Manos Revés</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Entrenador</span>
              <span>Kevin Konfederak</span>
            </div>
          </div>
        </div>
        <h3 className="text-lg mb-2 font-semibold border-b pb-2">
          Estadísticas
        </h3>
        <div className="md:grid md:grid-cols-2 md:gap-4">
          <div className="mb-4">
            <div className="flex justify-between">
              <span className="font-semibold">Partidos Jugados</span>
              <span>25</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Partidos Ganados</span>
              <span>17</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Partidos Perdidos</span>
              <span>6</span>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between">
              <span className="font-semibold">Sets Jugados</span>
              <span>231</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Set Ganados</span>
              <span>1231</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Set Perdidos</span>
              <span>1231</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ProfilePlayer;
