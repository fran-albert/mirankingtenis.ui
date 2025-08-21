"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCustomSession } from "@/context/SessionAuthProviders";
import Loading from "./Loading/loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { session, status } = useCustomSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !session) {
      router.push("/iniciar-sesion");
      return;
    }

    if (adminOnly && !session.user.roles?.includes("ADMINISTRADOR")) {
      router.push("/");
      return;
    }
  }, [session, status, router, adminOnly]);

  if (status === "loading") {
    return <Loading isLoading={true} />;
  }

  if (status === "unauthenticated" || !session) {
    return <Loading isLoading={true} />;
  }

  if (adminOnly && !session.user.roles?.includes("ADMINISTRADOR")) {
    return <Loading isLoading={true} />;
  }

  return <>{children}</>;
}