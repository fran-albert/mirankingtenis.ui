"use client";
import Loading from "@/components/Loading/loading";
import { useUser } from "@/hooks/Users/useUser";
import { useParams } from "next/navigation";
import React from "react";

function EditPlayerPage() {
  const params = useParams();
  const id = params.id;
  
  const { user, isLoading } = useUser({
    id: Number(id),
    auth: true,
  });
  
  if (isLoading) {
    return <Loading isLoading={true} />;
  }
  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-grow flex justify-center items-center">
        {/* <EditPatientForm patient={patient} /> */}
        {/* <EditPlayerForm user={user} /> */}
      </div>
    </div>
  );
}

export default EditPlayerPage;
