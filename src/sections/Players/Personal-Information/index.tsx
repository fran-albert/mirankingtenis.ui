import { User } from "@/modules/users/domain/User";
import React from "react";

function PersonalInformation({ player }: { player: User | undefined }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Información Personal</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500 dark:text-gray-400 mb-1">
            Nombre Completo
          </p>
          <p>
            {player?.name} {player?.lastname}
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 mb-1">Edad</p>
          <p>41</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 mb-1">Ciudad</p>
          <p>{player?.city.city}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 mb-1">Teléfono</p>
          <p>{player?.phone}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 mb-1">
            Correo Electrónico
          </p>
          <p>{player?.email}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 mb-1">Sexo</p>
          <p>{player?.gender}</p>
        </div>
      </div>
    </div>
  );
}

export default PersonalInformation;
