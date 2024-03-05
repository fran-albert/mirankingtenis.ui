import Loading from "@/components/Loading/loading";
import NewPasswordForm from "@/sections/Auth/NewPassword/newPasswordForm";
import React, { Suspense } from "react";

function NewPasswordPage() {
  return (
    <div>
      <Suspense fallback={<div> cargando...</div>}>
        <NewPasswordForm />
      </Suspense>
    </div>
  );
}

export default NewPasswordPage;
