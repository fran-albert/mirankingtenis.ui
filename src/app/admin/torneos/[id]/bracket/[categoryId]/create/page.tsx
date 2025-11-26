import React from "react";
import { notFound } from "next/navigation";
import CreateBracketView from "@/sections/Admin/Tournament/Bracket/CreateBracketView";

interface CreateBracketPageProps {
  params: Promise<{
    id: string;
    categoryId: string;
  }>;
}

export default async function CreateBracketPage({ params }: CreateBracketPageProps) {
  const { id, categoryId } = await params;
  const tournamentId = parseInt(id);
  const categoryIdNum = parseInt(categoryId);

  if (isNaN(tournamentId) || isNaN(categoryIdNum)) {
    notFound();
  }

  return <CreateBracketView tournamentId={tournamentId} categoryId={categoryIdNum} />;
}
