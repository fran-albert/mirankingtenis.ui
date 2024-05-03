import { Ranking } from "@/modules/ranking/domain/Ranking";
import { User } from "@/modules/users/domain/User";
import Image from "next/image";
import React from "react";

export const MasterCard = ({ players }: { players: Ranking[] }) => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {players.map((player) => (
          <div
            key={player.id}
            onClick={() =>
                (window.location.href = `/jugadores/${player.user.id}`)
              }
            className="group relative cursor-pointer items-center justify-center overflow-hidden transition-shadow hover:shadow-xl hover:shadow-black/30"
          >
            <div className="h-64 w-64">
              <Image
                className="object-cover transition-transform duration-500 group-hover:rotate-3 group-hover:scale-125"
                src={
                  player.user.photo
                    ? `https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${player.user.photo}.jpeg`
                    : "https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/mirankingtenis_default.png"
                }
                height={256}
                width={256}
                quality={100}
                alt={`Avatar of ${player.user.name}`}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black group-hover:from-black/70 group-hover:via-black/60 group-hover:to-black/70"></div>
            <div className="absolute inset-0 flex translate-y-[50%] flex-col items-center justify-center px-9 text-center transition-all duration-500 group-hover:translate-y-0">
              <h1 className="font-dmserif text-2xl font-bold text-white">
                {player.position}° {player.user.name}
              </h1>
              <p className="text-lg italic text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Partidos Jugados: {player.playedMatches}
              </p>
              <p className="text-lg italic text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Partidos Ganados: {player.wonMatches}
              </p>
              <p className="text-lg italic text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Partidos Perdidos: {player.lostMatches}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
