import React from "react";
import { PiWarningCircleDuotone } from "react-icons/pi";

function NotFoundPage() {
  return (
    <div className="container flex mt-20 px-6 py-12 mx-auto">
      <div className="flex flex-col items-center max-w-sm mx-auto text-center">
        <p className="p-3 text-sm font-medium text-slate-500 rounded-full bg-slate-50 ">
          <PiWarningCircleDuotone className="w-10 h-10" />
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
          Página no encontrada
        </h1>
      </div>
    </div>
  );
}

export default NotFoundPage;
