// pages/profile.js
"use client";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { getUser } from "@/modules/users/application/get/getUser";
import { User } from "@/modules/users/domain/User";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProfilePage() {

  const { session } = useCustomSession();
  const idUser =  Number(session?.user.id);
  const [user, setUser] = useState<User>();
  const userRepository = createApiUserRepository();
  const loadUser = getUser(userRepository);

  console.log(session)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await loadUser(idUser);
        setUser(userData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  console.log(user)


  return (
    <div className="flex justify-center w-full px-4 lg:px-0 m-2">
      <div className="w-full max-w-7xl bg-white rounded-xl">
        <div className=" p-6 shadow rounded-lg">
          {/* Header */}
          <div className="border-b pb-6">
            <h2 className="text-2xl font-semibold leading-tight">Mi Perfil</h2>
          </div>

          {/* User Info */}
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-24 h-24 mb-3">
              <Image
                src="https://www.atptour.com/-/media/tennis/players/head-shot/2020/02/26/11/55/federer_head_ao20.png?sc=0&hash=7A17A4E9C10DF90A2C987081C7EEE1E8"
                alt="Profile Picture"
                width={96}
                height={96}
                className="rounded-full"
              />
            </div>
            <h3 className="text-xl font-medium">{user?.name}</h3>
            <p className="text-gray-600">{user?.role}</p>
          </div>

          {/* Stats */}
          <div className="flex justify-center space-x-10 py-6">
            <div className="text-center">
              <div className="text-2xl font-semibold">{user?.name}</div>
              <div className="text-gray-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold">{user?.name}</div>
              <div className="text-gray-600">Following</div>
            </div>
          </div>

          {/* Profile Navigation */}
          <div className="flex justify-around text-sm font-medium text-gray-600 border-t border-b py-3">
            <a href="#" className="hover:text-blue-600">
              Profile
            </a>
            <a href="#" className="hover:text-blue-600">
              Followers
            </a>
            <a href="#" className="hover:text-blue-600">
              Friends
            </a>
            <a href="#" className="hover:text-blue-600">
              Gallery
            </a>
          </div>

          {/* About Me & Social Links */}
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start py-6">
            <div className="lg:w-1/2 lg:pr-10">
              <h3 className="text-lg font-medium leading-tight mb-3">
                About Me
              </h3>
              <p className="text-gray-600 text-sm">{user?.name}</p>
            </div>
            <div className="lg:w-1/2 space-y-2 mt-6 lg:mt-0">
              <h3 className="text-lg font-medium leading-tight mb-3">
                Social Media Link
              </h3>
              <div className="flex flex-wrap justify-center lg:justify-start">
                {/* {Object.entries(user?.name).map(([network, url]) => (
                  <a
                    key={network}
                    href={url}
                    className="flex items-center text-blue-600 hover:underline mr-4 mb-2"
                  >
                    <i className={`fab fa-${network} fa-lg mr-2`}></i>
                    {network.charAt(0).toUpperCase() + network.slice(1)}
                  </a>
                ))} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
