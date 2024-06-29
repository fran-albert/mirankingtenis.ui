import ClientRankingComponent from "@/components/Client/Ranking";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ranking",
};

function RankingPage() {
  return <ClientRankingComponent />;
}

export default RankingPage;
