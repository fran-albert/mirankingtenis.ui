"use client";
import { RankingTable } from "@/sections/Ranking/Table/table";
import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function RankingPage() {
  return (
    <>
      <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
        <div className="w-full max-w-7xl">
          <div className="flex items-center justify-center py-2 px-4 bg-white rounded-lg shadow">
            <button className="mr-2">
              <FaArrowLeft className="h-6 w-6 text-gray-800" />
            </button>

            <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
              <span className="whitespace-nowrap py-1 px-4 bg-slate-500 text-white rounded-full">
                Categoría A
              </span>
              <span className="whitespace-nowrap py-1 px-4">Categoría B</span>
              <span className="whitespace-nowrap py-1 px-4">Categoría C</span>
            </div>

            <button className="ml-2">
              <FaArrowRight className="h-6 w-6 text-gray-800" />
            </button>
          </div>
          <RankingTable />
        </div>
      </div>
    </>
  );
}

export default RankingPage;
