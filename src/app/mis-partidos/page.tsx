import React from "react";
import { Metadata } from "next";
import ClientMyMatchesComponent from "@/components/Client/MyMatches";

export const metadata: Metadata = {
  title: "Mis Partidos",
};
function MyMatchesPage() {
  return <ClientMyMatchesComponent />;
}

export default MyMatchesPage;
