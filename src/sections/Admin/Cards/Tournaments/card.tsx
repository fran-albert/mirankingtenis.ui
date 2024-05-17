"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import { GiTrophyCup } from "react-icons/gi";
import { createApiTournamentRepository } from "@/modules/tournament/infra/ApiTournamentRepository";
export const TournamentsCount = () => {
  const [totalTournaments, setTotalTournaments] = useState(0);

  useEffect(() => {
    const fetchTotal = async () => {
      const userRepository = createApiTournamentRepository();
      const total = await userRepository.getTotalTournaments();
      setTotalTournaments(total);
    };

    fetchTotal().catch(console.error);
  }, []);
  return (
    <>
      <div className="rounded-lg w-96 sm:transition sm:duration-300 sm:ease-in-out sm:transform sm:hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
        <Link href={`/admin/torneos`}>
          <Card>
            <CardHeader className="flex justify-between items-center">
              <GiTrophyCup size={25} color="#365314" />
              <CardTitle>Torneos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center max-w-full">
                <div className="text-3xl font-bold">{totalTournaments}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400"></div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </>
  );
};
