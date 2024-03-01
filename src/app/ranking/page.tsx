"use client";
import { RankingTable } from "@/sections/Ranking/Table/table";
import RankingTabs from "@/sections/Ranking/Tabs/tabs";
import React from "react";

function RankingPage() {
  const [selectedCategory, setSelectedCategory] = React.useState(1);
  return (
    <>
      <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
        <div className="w-full max-w-7xl space-y-6">
          <h1 className="text-2xl text-center font-medium">Ranking</h1>
          <RankingTabs
            onSelectCategory={(idCategory: number) =>
              setSelectedCategory(idCategory)
            }
          />
          <div className="mt-4">
            <RankingTable selectedCategory={selectedCategory} />
          </div>
        </div>
      </div>
    </>
  );
}

export default RankingPage;
