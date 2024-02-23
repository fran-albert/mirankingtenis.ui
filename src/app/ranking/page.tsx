"use client";
import { RankingTable } from "@/sections/Ranking/Table/table";
import React from "react";

function RankingPage() {
  return (
    <>
      <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
        <div className="w-full max-w-7xl">
          <RankingTable />
        </div>
      </div>
    </>
  );
}

export default RankingPage;
