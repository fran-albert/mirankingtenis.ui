import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@/modules/users/domain/User";
import Link from "next/link";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import useRoles from "@/hooks/useRoles";
import DeleteMatchDialog from "../Delete/button";

export const ScoreMatchCard = ({
  player1,
  player2,
  match,
  onDeleteMatch,
}: {
  player1: User;
  player2: User;
  match: number;
  onDeleteMatch: () => void;
}) => {
  const { isAdmin } = useRoles();
  const handleEdit = (idPlayer: number) => {
    console.log(`Editar partido con ID: ${match}`);
    // Aquí puedes añadir la lógica para editar el partido
  };

  return (
    <Card className="w-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle>
          <div className="text-xs font-bold text-gray-900">Pendiente</div>
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <div className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <div className="text-red-500 font-bold">
                    <Avatar>
                      <AvatarImage
                        src={
                          player1.photo
                            ? `https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/${player1.photo}`
                            : "https://www.atptour.com/-/media/tennis/players/head-shot/2020/02/26/11/55/federer_head_ao20.png?sc=0&hash=7A17A4E9C10DF90A2C987081C7EEE1E8"
                        }
                        alt="@avatar"
                      />
                    </Avatar>
                  </div>
                  <div className="text-xs font-bold text-gray-500">
                    {player1.ranking ? player1.ranking.position : "-"}
                  </div>
                  <Link
                    href={`/jugadores/${player1.id}`}
                    className="font-medium text-gray-900 hover:text-blue-500"
                  >
                    {player1.lastname}, {player1.name}
                  </Link>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="font-bold">-</div>
                  <div className="font-bold">-</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <div className="flex flex-col space-y-1.5">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="text-red-500 font-bold">
                      <Avatar>
                        <AvatarImage
                          src={
                            player2.photo
                              ? `https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/${player2.photo}`
                              : "https://www.atptour.com/-/media/tennis/players/head-shot/2020/02/26/11/55/federer_head_ao20.png?sc=0&hash=7A17A4E9C10DF90A2C987081C7EEE1E8"
                          }
                          alt="@avatar"
                        />
                      </Avatar>
                    </div>
                    <div className="text-xs font-bold text-gray-500">
                      {player2.ranking ? player2.ranking.position : "-"}
                    </div>
                    <Link
                      href={`/jugadores/${player2.id}`}
                      className="font-medium text-gray-900 hover:text-blue-500"
                    >
                      {player2.lastname}, {player2.name}
                    </Link>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="">-</div>
                    <div className="">-</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">Día - Cancha</div>
        {isAdmin && (
          <div className="flex items-center space-x-2">
            <button onClick={() => handleEdit(player1.id)} className="p-2">
              <FaPencilAlt className="text-slate-500 hover:text-slate-800" />
            </button>
            <DeleteMatchDialog onDeleteMatch={onDeleteMatch} />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
