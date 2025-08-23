"use client";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { BiSolidCategory } from "react-icons/bi";
import { useTotalCategories } from "@/hooks/Category";

export const CategoriesCount = () => {
  const { total: totalUsers } = useTotalCategories();
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
                <div className="text-sm text-gray-500 "></div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </>
  );
};
