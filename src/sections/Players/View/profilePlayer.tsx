import { getUser } from "@/modules/users/application/get/getUser";
import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import Image from "next/image";
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
  }, [Number(id)]);

  return (
    <>
      <div className="bg-slate-800 m-8 p-6 rounded-xl shadow-2xl text-white flex flex-col items-center space-y-4">
        <div className="rounded-full overflow-hidden border-8 border-gray-400 shadow-xl">
          <Image
            src={`https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${player?.photo}.jpeg`}
            alt="Player"
            width={132}
            height={132}
            className="w-32 h-32 md:w-48 md:h-48 object-cover"
          />
        </div>
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold">
            {player?.name} {player?.lastname}
          </h1>
          <p className="text-md md:text-lg mt-2">
            Categoría {player?.category.name} - Ranking actual:{" "}
            {player?.ranking.position}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          <div className="bg-slate-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Datos Personales</h2>
            <ul className="text-sm space-y-2">
              <li>Edad: 25 años (1998.08.13)</li>
              <li>Peso: 176 lbs (80 kg)</li>
              <li>Estatura: 185 cm</li>
              <li>País: Argentina</li>
              <li>Mano: Diestro, Dos Manos Revés</li>
              <li>Entrenador: Kevin Konfederak</li>
            </ul>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Estadísticas</h2>
            <ul className="text-sm space-y-2">
              <li>Partidos Jugados: {player?.ranking.playedMatches}</li>
              <li>Partidos Ganados: {player?.ranking.wonMatches}</li>
              <li>Partidos Perdidos: {player?.ranking.lostMatches}</li>
              <li>Sets Jugados: 231</li>
              <li>Set Ganados: 1231 (Revisar este dato, parece incorrecto)</li>
              <li>Set Perdidos: 1231 (Revisar este dato, parece incorrecto)</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePlayer;
