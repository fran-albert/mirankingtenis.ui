"use client";
import Profile from "@/sections/Auth/Profile/profile";

export default function ProfilePage() {
  return (
    <>
      <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
        <div className="w-full max-w-7xl space-y-6">
          <Profile />
        </div>
      </div>
    </>
  );
}
