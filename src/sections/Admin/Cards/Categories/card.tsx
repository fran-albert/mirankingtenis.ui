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
import { createApiCategoryRepository } from "@/modules/category/infra/ApiCategoryRepository";
import { BiSolidCategory } from "react-icons/bi";
export const CategoriesCount = () => {
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchTotalCategories = async () => {
      const userRepository = createApiCategoryRepository();
      const total = await userRepository.getTotalCategories();
      setTotalUsers(total);
    };

    fetchTotalCategories().catch(console.error);
  }, []);
  return (
    <>
      <div className="rounded-lg w-96 sm:transition sm:duration-300 sm:ease-in-out sm:transform sm:hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
        <Link href={`/admin/categorias`}>
          <Card>
            <CardHeader className="flex justify-between items-center">
              <BiSolidCategory size={25} color="#365314" />
              <CardTitle>Categorías</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center max-w-full">
                <div className="text-3xl font-bold">{totalUsers}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400"></div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </>
  );
};
