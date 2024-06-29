import React from "react";
import { Metadata } from "next";
import ClientMatchesComponent from "@/components/Client/Matches";

export const metadata: Metadata = {
  title: "Partidos",
};
function MyMatchesPage() {
  return <ClientMatchesComponent />;
}

export default MyMatchesPage;
