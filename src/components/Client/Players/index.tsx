"use client";
import { PlayersTable } from "@/sections/Players/Table/table";
import React from "react";

function ClientPlayerComponent() {
  return (
    <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
      <div className="w-full max-w-7xl">
        <PlayersTable />
      </div>
    </div>
  );
}

export default ClientPlayerComponent;
