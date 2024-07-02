"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GiTennisCourt } from "react-icons/gi";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { createApiCourtRepository } from "@/modules/court/infra/ApiCourtRepository";

export const CourtsCount = () => {
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchTotalPlayers = async () => {
      const courtRepository = createApiCourtRepository();
      const total = await courtRepository.getTotalCourts();
      setTotalUsers(total);
    };

    fetchTotalPlayers().catch(console.error);
  }, []);
  return (
    <>
      <div className="rounded-lg w-96 sm:transition sm:duration-300 sm:ease-in-out sm:transform sm:hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
        <Link href={`/admin/canchas`}>
          <Card>
            <CardHeader className="flex justify-between items-center">
              <GiTennisCourt className="w-6 h-6" color="#365314" />
              <CardTitle>Canchas</CardTitle>
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
