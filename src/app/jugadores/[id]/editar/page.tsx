"use client";
import Loading from "@/components/Loading/loading";
import { getUser } from "@/modules/users/application/get/getUser";
import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import EditPlayerForm from "@/sections/Players/Edit/EditPlayerForm";
// import { Patient } from "@/modules/patients/domain/Patient";
// import { createApiPatientRepository } from "@/modules/patients/infra/ApiPatientRepository";
// import EditPatientForm from "@/sections/users/patients/edit/EditPatientForm";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";

function EditPlayerPage() {
  const [user, setUser] = useState<User | null>(null);
  const params = useParams();
  const id = params.id;
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const userRepository = createApiUserRepository();
    const loadUser = getUser(userRepository);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const userData = await loadUser(Number(id));
      setUser(userData ?? null);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) {
    return <Loading isLoading />;
  }
  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-grow flex justify-center items-center">
        {/* <EditPatientForm patient={patient} /> */}
        <EditPlayerForm user={user} />
      </div>
    </div>
  );
}

export default EditPlayerPage;
