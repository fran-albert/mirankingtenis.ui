"use client";
import Loading from "@/components/Loading/loading";
import { useDoublesMatches } from "@/hooks/Doubles-Express/useDoublesMatches";
import { useUserDoubleExpressPointHistory } from "@/hooks/User-Double-Express-Points-History/useUserDoubleExpressPointHistory";
import useRoles from "@/hooks/useRoles";
import { useUsers } from "@/hooks/Users/useUsers";
import Home from "@/sections/Express-Dobles/Home";
import React from "react";

function ClientExpressDoblesComponent() {
  const { session } = useRoles();
  const { doublesMatches, error, isLoading } = useDoublesMatches({
    auth: true,
    fetchMatches: true,
  });

  const { isLoading: isLoadingPoints, points } =
    useUserDoubleExpressPointHistory({
      auth: true,
      id: Number(session?.user.id),
    });
  const { isLoading: isLoadingUsers, users } = useUsers({
    auth: true,
    fetchUsers: true,
  });

  if (isLoading || isLoadingUsers || isLoadingPoints) {
    return <Loading isLoading />;
  }

  return (
    <div className="container">
      <Home
        doublesMatches={doublesMatches}
        users={users}
        points={Number(points)}
      />
    </div>
  );
}

export default ClientExpressDoblesComponent;
