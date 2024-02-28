import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

export const ScoreMatchCard = ({
  player1,
  player2,
  round,
  court,
}: {
  player1: any;
  player2: any;
  round: any;
  court: any;
}) => {
  return (
    <>
      <Card className="w-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>
            <div className="text-xs font-bold text-gray-900">Final</div>
          </CardTitle>
          <CardDescription>Descripción</CardDescription>
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
                          // src={
                          //   row.original.photo
                          //     ? `https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/${row.original.photo}`
                          //     : "https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/default.png"
                          // }
                          src={
                            "https://www.atptour.com/-/media/tennis/players/head-shot/2020/02/26/11/55/federer_head_ao20.png?sc=0&hash=7A17A4E9C10DF90A2C987081C7EEE1E8"
                          }
                          alt="@avatar"
                        />
                        <AvatarFallback>probando</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="text-xs font-bold text-gray-500">3</div>
                    <div className="font-medium">FRANCISCO</div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="font-bold">6</div>
                    <div className="font-bold">6</div>
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
                            // src={
                            //   row.original.photo
                            //     ? `https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/${row.original.photo}`
                            //     : "https://incor-ranking.s3.us-east-1.amazonaws.com/storage/avatar/default.png"
                            // }
                            src={
                              "https://www.atptour.com/-/media/tennis/players/head-shot/2020/02/26/11/55/federer_head_ao20.png?sc=0&hash=7A17A4E9C10DF90A2C987081C7EEE1E8"
                            }
                            alt="@avatar"
                          />
                          <AvatarFallback>probando</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="text-xs font-bold text-gray-500">3</div>
                      <a
                        href="/perfil/francisco"
                        className="font-medium text-gray-900 hover:text-blue-500"
                      >
                        FRANCISCO
                      </a>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="">4</div>
                      <div className="">4</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">26 02 - Cancha 1</div>
        </CardFooter>
      </Card>
    </>
  );
};
