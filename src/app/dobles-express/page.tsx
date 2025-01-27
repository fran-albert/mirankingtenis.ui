import React from "react";
import { Metadata } from "next";
import ClientExpressDoblesComponent from "@/components/Client/Express-Dobles";

export const metadata: Metadata = {
  title: "Dobles Express",
};
function ExpressDoblesPage() {
  return <ClientExpressDoblesComponent />;
}

export default ExpressDoblesPage;
