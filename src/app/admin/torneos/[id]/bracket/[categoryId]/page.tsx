import React from "react";
import { notFound } from "next/navigation";
import BracketView from "@/sections/Admin/Tournament/Bracket/BracketView";

interface BracketPageProps {
  params: Promise<{
    id: string;
    categoryId: string;
  }>;
}

export default async function BracketPage({ params }: BracketPageProps) {
  const { id, categoryId } = await params;
  const tournamentId = parseInt(id);
  const categoryIdNum = parseInt(categoryId);

  if (isNaN(tournamentId) || isNaN(categoryIdNum)) {
    notFound();
  }

  return <BracketView tournamentId={tournamentId} categoryId={categoryIdNum} />;
}
