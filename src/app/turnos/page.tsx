import React from "react";
import { Metadata } from "next";
import ClientShiftComponent from "@/components/Client/Shift";

export const metadata: Metadata = {
  title: "Turnos",
};
function ShiftPage() {
  return <ClientShiftComponent />;
}

export default ShiftPage;
