import { User } from "@/modules/users/domain/User";
import React from "react";
import { IoLocationSharp, IoMailSharp } from "react-icons/io5";
import { FaPerson, FaPhone } from "react-icons/fa6";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
function PersonalInformation({ player }: { player: User | null }) {
  return (
    <div>
      <Card className="w-full max-w-full">
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-2">
            <FaPhone className="h-5 w-5 text-muted-foreground" />
            <span>{player?.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaPerson className="h-5 w-5 text-muted-foreground" />
            <span>{player?.gender === "male" ? "Masculino" : "Femenino"}</span>
          </div>
          <div className="flex items-center gap-2">
            <IoLocationSharp className="h-5 w-5 text-muted-foreground" />
            <span>{player?.city.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <IoMailSharp className="h-5 w-5 text-muted-foreground" />
            <span>{player?.email}</span>
          </div>
        </CardContent>
      </Card>
      {/* <div className="grid grid-cols-2 gap-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
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
          <p></p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 mb-1">Ciudad</p>
          <p>{player?.city.city}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 mb-1">Teléfono</p>
          <p></p>
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
      </div> */}
    </div>
  );
}

export default PersonalInformation;
