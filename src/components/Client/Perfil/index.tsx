"use client";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { useUser } from "@/hooks/Users/useUser";
import Loading from "@/components/Loading/loading";
import PerfilPage from "@/sections/Auth/Profile/Card";

export default function ClientProfilePage() {
  const { session } = useCustomSession();
  const idUser = session?.user.id as number;
  const { user, isLoading } = useUser({
    auth: true,
    id: idUser,
  });

  if (isLoading || !user) {
    return <Loading isLoading />;
  }

  return <PerfilPage user={user} />;
}
