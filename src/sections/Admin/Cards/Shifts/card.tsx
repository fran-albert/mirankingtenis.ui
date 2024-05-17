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
export const ShiftsCount = () => {
  const [totalShifts, setTotalShifts] = useState(0);

  useEffect(() => {
    const fetchTotalPlayers = async () => {
      const userRepository = createApiUserRepository();
      const total = await userRepository.getTotalUsers();
      setTotalShifts(total);
    };

    fetchTotalPlayers().catch(console.error);
  }, []);
  return (
    <>
      <div className="rounded-lg w-96 sm:transition sm:duration-300 sm:ease-in-out sm:transform sm:hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
        <Link href={`/admin/turnos`}>
          <Card>
            <CardHeader className="flex justify-between items-center">
              <FaUser className="w-6 h-6" color="#0f766e" />
              <CardTitle>Turnos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center max-w-full">
                <div className="text-3xl font-bold">{totalShifts}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400"></div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </>
  );
};
