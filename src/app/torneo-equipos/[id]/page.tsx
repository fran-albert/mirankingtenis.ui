import { Metadata } from "next";
import { TeamEventPublicDetail } from "@/sections/Team-Event/Public/TeamEventPublicDetail";

export const metadata: Metadata = {
  title: "Torneo por Equipos",
};

export default function TeamEventDetailPage() {
  return <TeamEventPublicDetail />;
}
