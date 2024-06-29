import React from "react";
import ClientPlayerComponent from "@/components/Client/Players";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jugadores",
};

const PlayersPage = () => {
  return <ClientPlayerComponent />;
};

export default PlayersPage;
