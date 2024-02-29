import { StepsController  } from "@/sections/Fixture/stepController";
import React from "react";

function FixturePage() {
  return (
    <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
      <div className="w-full max-w-7xl">
        <StepsController  />
      </div>
    </div>
  );
}

export default FixturePage;
