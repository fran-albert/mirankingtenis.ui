import { Metadata } from "next";
import { TeamEventsPublicList } from "@/sections/Team-Event/Public/TeamEventsPublicList";

export const metadata: Metadata = {
  title: "Torneo por Equipos",
};

export default function TeamEventsPage() {
  return <TeamEventsPublicList />;
}
