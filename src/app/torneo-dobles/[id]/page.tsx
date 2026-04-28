import React from "react";
import ClientDoublesTournamentComponent from "@/components/Client/Doubles-Tournament";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Torneo Dobles",
};

interface DoublesTournamentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DoublesTournamentDetailPage({
  params,
}: DoublesTournamentDetailPageProps) {
  const { id } = await params;

  return <ClientDoublesTournamentComponent eventId={Number(id)} />;
}
