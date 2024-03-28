"use client";
import { ShiftTable } from "@/sections/Shifts/Table/table";
import React from "react";

function ShiftsPage() {
  return (
    <div className="flex justify-center w-full px-4 lg:px-0 mt-2">
      <div className="">
        <ShiftTable />
      </div>
    </div>
  );
}

export default ShiftsPage;
