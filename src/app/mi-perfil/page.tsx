import React from "react";
import { Metadata } from "next";
import ClientProfilePage from "@/components/Client/Perfil";

export const metadata: Metadata = {
  title: "Mi Perfil",
};
function ProfilePage() {
  return <ClientProfilePage />;
}

export default ProfilePage;
