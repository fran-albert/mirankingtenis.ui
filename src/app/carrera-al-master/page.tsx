import { Metadata } from "next";
import CarreraAlMasterClient from "@/components/Client/CarreraAlMaster";

export const metadata: Metadata = {
  title: "Carrera al Master - Mi Ranking Tenis",
  description: "Los 8 mejores jugadores de la liga actual clasificados para el Master",
};

export default function CarreraAlMasterPage() {
  return <CarreraAlMasterClient />;
}