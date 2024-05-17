"use client";
import { CategoriesCount } from "@/sections/Admin/Cards/Categories/card";
import { CourtsCount } from "@/sections/Admin/Cards/Courts/card";
import { UsersCount } from "@/sections/Admin/Cards/Players/card";
import { ShiftsCount } from "@/sections/Admin/Cards/Shifts/card";
import { TournamentsCount } from "@/sections/Admin/Cards/Tournaments/card";
import React from "react";

function AdminHomePage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <UsersCount />
        <CourtsCount />
        <CategoriesCount />
        {/* <ShiftsCount /> */}
        <TournamentsCount />
      </div>
    </main>
  );
}

export default AdminHomePage;
