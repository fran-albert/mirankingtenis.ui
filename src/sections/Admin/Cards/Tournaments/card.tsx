"use client";
import Link from "next/link";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { GiTrophyCup } from "react-icons/gi";
import { useTotalTournaments } from "@/hooks/Tournament/useTournament";
export const TournamentsCount = () => {
  // Usar React Query hook
  const { total: totalTournaments = 0 } = useTotalTournaments();
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
                <div className="text-sm text-gray-500 "></div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </>
  );
};
