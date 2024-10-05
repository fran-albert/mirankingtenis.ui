import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import useRoles from "@/hooks/useRoles";
import { User } from "@/types/User/User";
import Image from "next/image";
import React from "react";
import DefaultPasswordDialog from "../DefaultPassword/dialog";

function UserCardComponent({ player }: { player: User | undefined }) {
  const { isPlayer, isAdmin } = useRoles();
  return (
    <>
      <Card className="w-full max-w-lg shadow-md rounded-lg overflow-hidden mb-4">
        <CardHeader className="flex flex-col sm:flex-row p-4 items-start sm:items-center">
          <div className="flex-shrink-0 pb-4 sm:pb-0">
            <Image
              className="rounded-xl"
              src={
                player?.photo
                  ? `https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/${player?.photo}.jpeg`
                  : "https://mirankingtenis.s3.us-east-1.amazonaws.com/storage/avatar/mirankingtenis_default.png"
              }
              alt=""
              height={100}
              width={100}
            />
          </div>
          <div className="flex-grow sm:pl-4">
            <CardTitle className="text-gray-900 text-lg font-bold">
              {player?.name} {player?.lastname}
            </CardTitle>
            <p className="text-gray-600 font-medium">
              {player?.ranking.position}° - Categoría {player?.category.name}
            </p>
          </div>
          {isAdmin && <DefaultPasswordDialog id={Number(player?.id)} />}
        </CardHeader>
      </Card>
    </>
  );
}

export default UserCardComponent;
