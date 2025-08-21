"use client";
import Link from "next/link";
import { FaUsers } from "react-icons/fa";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { useTotalUsers } from "@/hooks/Users/useTotalUsers";

export const UsersCount = () => {
  const { totalUsers } = useTotalUsers({ enabled: true });
  return (
    <>
      <div className="rounded-lg w-96 sm:transition sm:duration-300 sm:ease-in-out sm:transform sm:hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
        <Link href={`/admin/jugadores`}>
          <Card>
            <CardHeader className="flex justify-between items-center">
              <FaUsers size={25} color="#365314" />
              <CardTitle>Jugadores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center max-w-full">
                <div className="text-3xl font-bold">{totalUsers}</div>
                <div className="text-sm text-gray-500 "></div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </>
  );
};
