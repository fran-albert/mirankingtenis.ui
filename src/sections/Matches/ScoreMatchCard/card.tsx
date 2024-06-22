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
import { es } from "date-fns/locale/es";
import { registerLocale } from "react-datepicker";
import { formatDate } from "@/lib/utils";
import { Match } from "@/modules/match/domain/Match";
import { BadgeWin } from "@/components/Badge/Green/badge";
import DecideMatchDialog from "../DecideWinner/button";
registerLocale("es", es);
export const ScoreMatchCard = ({
  player1,
  player2,
  match,
  onMatchDecided,
  onDeleteMatch,
}: {
  player1: User;
  player2: User;
  match: Match;
  onMatchDecided: () => void;
  onDeleteMatch: () => void;
}) => {
  const { isAdmin } = useRoles();
  const handleEdit = (idPlayer: number) => {
    console.log(`Editar partido con ID: ${match}`);
  };


  console.log(match)

  return (
    <Card className="w-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg rounded-lg ">
      <CardHeader>
        <CardTitle>
          <div className="text-xs font-bold text-gray-900">
            {match.status === "played" ? "Final" : "Pendiente"}
          </div>
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <div className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <div className="text-slate-700 font-bold">
                    <Avatar>
                      <AvatarImage
                        src={
                          player1?.photo
                            ? `https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${player1?.photo}.jpeg`
                            : "https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/mirankingtenis_default.png"
                        }
                        alt="@avatar"
                      />
                      <AvatarFallback>
                        {player1?.name?.charAt(0) || ""}
                        {player1?.lastname?.charAt(0) || ""}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="text-xs font-bold text-gray-500">
                    {match.user1position ? match.user1position : "-"}
                  </div>
                  <Link
                    href={`/jugadores/${match.idUser1}`}
                    className="font-medium text-base md:text-xl lg:text-xl text-gray-900 hover:text-sky-800"
                  >
                    {match.user1.toString()}
                    {match.idWinner === player1.id && (
                      <span className="ml-2 text-sm font-semibold ">
                        <BadgeWin text="Ganador" />
                      </span>
                    )}
                  </Link>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  {match.sets
                    .sort((a, b) => a.setNumber - b.setNumber)
                    .map((set, index) => (
                      <div
                        key={index}
                        className="text-xl font-bold text-gray-800 text-center min-w-[1.5rem]"
                      >
                        {set.pointsPlayer1}
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <div className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <div className="text-slate-700 font-bold">
                    <Avatar>
                      <AvatarImage
                        src={
                          player2?.photo
                            ? `https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${player2?.photo}.jpeg`
                            : "https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/mirankingtenis_default.png"
                        }
                        alt="@avatar"
                      />
                      <AvatarFallback>
                        {player2?.user2name?.charAt(0) || ""}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="text-xs font-bold text-gray-500">
                    {match.user2position ? match.user2position : "-"}
                  </div>
                  <Link
                    href={`/jugadores/${match.idUser2}`}
                    className="font-medium text- md:text-xl lg:text-xl text-gray-900 hover:text-sky-800"
                  >
                    {match.user2.toString()}
                    {match.idWinner === player2.id && (
                      <span className="ml-2 text-sm font-semibold text-green-600">
                        <BadgeWin text="Ganador" />
                      </span>
                    )}
                  </Link>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  {match.sets
                    .sort((a, b) => a.setNumber - b.setNumber)
                    .map((set, index) => (
                      <div
                        key={index}
                        className="text-xl font-bold text-gray-800 text-center min-w-[1.5rem]"
                      >
                        {set.pointsPlayer2}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          {match.shift && match.shift.startHour && (
            <span>
              {formatDate(match?.shift?.startHour)} - Cancha{" "}
              {match?.shift?.court?.toString()}
            </span>
          )}
        </div>
        {isAdmin && (
          <div className="flex items-center space-x-2">
            {match.status !== "played" ? (
              <>
                <DecideMatchDialog
                  match={match}
                  onMatchDecided={onMatchDecided}
                />
                <button onClick={() => handleEdit(player1.id)}>
                  <FaPencilAlt className="text-slate-500 hover:text-slate-800" />
                </button>
              </>
            ) : (
              <button onClick={() => handleEdit(player1.id)}>
                <FaPencilAlt className="text-slate-500 hover:text-slate-800" />
              </button>
            )}
            <DeleteMatchDialog onDeleteMatch={onDeleteMatch} />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
