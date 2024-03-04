"use client";
import ProfilePlayer from "@/sections/Players/View/profilePlayer";
import React from "react";

function PlayerDetailsPage() {
  return (
    <div className="flex flex-col justify-center container mx-auto px-4 sm:px-6 lg:px-8">
      <ProfilePlayer />
    </div>
  );
}

export default PlayerDetailsPage;
