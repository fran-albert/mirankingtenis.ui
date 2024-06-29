import React from "react";
import ClientMasterComponent from "@/components/Client/Master";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Master",
};
function MasterPage() {
  return <ClientMasterComponent />;
}

export default MasterPage;
