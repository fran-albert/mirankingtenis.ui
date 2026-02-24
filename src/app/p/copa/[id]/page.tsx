import { Metadata } from "next";
import { TeamEventPublicDetail } from "@/sections/Team-Event/Public/TeamEventPublicDetail";

export const metadata: Metadata = {
  title: "Copa 9 GAMES - Mi Ranking Tenis",
};

export default function PublicTeamEventPage() {
  return <TeamEventPublicDetail isPublicView={true} />;
}
