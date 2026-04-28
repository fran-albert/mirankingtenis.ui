import React from "react";
import { DoublesEventsPublicList } from "@/sections/Doubles-Tournament/Public/DoublesEventsPublicList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Torneo Dobles",
};

const DoublesTournamentPage = () => {
  return <DoublesEventsPublicList />;
};

export default DoublesTournamentPage;
