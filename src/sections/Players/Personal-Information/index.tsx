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
    </div>
  );
}

export default PersonalInformation;
