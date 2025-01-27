"use client";
import Loading from "@/components/Loading/loading";
import { useDoublesMatches } from "@/hooks/Doubles-Express/useDoublesMatches";
import Home from "@/sections/Express-Dobles/Home";
import React from "react";

function ClientExpressDoblesComponent() {
  const { doublesMatches, error, isLoading } = useDoublesMatches({
    auth: true,
    fetchMatches: true,
  });

  if (isLoading) {
    return <Loading isLoading />;
  }

  return (
    <div className="container">
      <Home doublesMatches={doublesMatches} />
    </div>
  );
}

export default ClientExpressDoblesComponent;
