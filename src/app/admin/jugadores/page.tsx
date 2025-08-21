"use client";
import Loading from "@/components/Loading/loading";
import { useCustomSession } from "@/context/SessionAuthProviders";
import useRoles from "@/hooks/useRoles";
import { useAdminUsers } from "@/hooks/Users/useAdminUsers";
import AdminPlayersTanstackTable from "@/sections/Admin/Players/Table/tanstack";
import React from "react";

function AdminPlayersPage() {
  const { isAdmin } = useRoles();
  const { session } = useCustomSession();
  const canAddUser = !!session && isAdmin;

  const { users: adminUsers, isLoading } = useAdminUsers({ 
    auth: !!session && !!isAdmin 
  });

  if (isLoading) {
    return <Loading isLoading={true} />;
  }

  return (
    <div>
      <AdminPlayersTanstackTable players={adminUsers} />
    </div>
  );
}

export default AdminPlayersPage;
