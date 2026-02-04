import React from "react";
import ClientDoublesTournamentComponent from "@/components/Client/Doubles-Tournament";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Torneo Dobles",
};

const DoublesTournamentPage = () => {
  return <ClientDoublesTournamentComponent />;
};

export default DoublesTournamentPage;
