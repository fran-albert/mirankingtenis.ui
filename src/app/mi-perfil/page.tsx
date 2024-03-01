// pages/profile.js
"use client";
import { useCustomSession } from "@/context/SessionAuthProviders";
import Profile from "@/sections/Auth/Profile/profile";

export default function ProfilePage() {
  const { session } = useCustomSession();
  const idUser = session?.user.id;

  return (
    <>
      <div className="flex justify-center w-full px-4 lg:px-0 mt-10">
        <div className="w-full max-w-7xl space-y-6">
          <Profile idUser={Number(idUser)} />
        </div>
      </div>
    </>
  );
}
