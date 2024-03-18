"use client"
import { ShiftTable } from "@/sections/Shifts/Table/table";
import React from "react";

function ShiftsPage() {
  return (
    <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
      <div className="w-full max-w-7xl">
        <ShiftTable />
      </div>
    </div>
  );
}

export default ShiftsPage;
