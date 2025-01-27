"use client";
import Loading from "@/components/Loading/loading";
import { useDoublesMatches } from "@/hooks/Doubles-Express/useDoublesMatches";
import { useUsers } from "@/hooks/Users/useUsers";
import Home from "@/sections/Express-Dobles/Home";
import React from "react";

function ClientExpressDoblesComponent() {
  const { doublesMatches, error, isLoading } = useDoublesMatches({
    auth: true,
    fetchMatches: true,
  });

  const { isLoading: isLoadingUsers, users } = useUsers({
    auth: true,
    fetchUsers: true,
  });

  if (isLoading || isLoadingUsers) {
    return <Loading isLoading />;
  }

  return (
    <div className="container">
      <Home doublesMatches={doublesMatches} users={users} />
    </div>
  );
}

export default ClientExpressDoblesComponent;
