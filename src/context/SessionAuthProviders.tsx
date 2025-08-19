"use client";
import React, { createContext, useContext, PropsWithChildren } from "react";
import { SessionProvider as NextAuthSessionProvider, useSession } from "next-auth/react";
import type { Session } from "next-auth";

// Solución temporal para next-auth v4 con React 19
// Cuando actualices a Auth.js v5, podrás quitar este tipo assertion
const SessionProvider = NextAuthSessionProvider as React.FC<{
  children: React.ReactNode;
  session?: Session | null;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
}>;

interface SessionContextType {
  session: ReturnType<typeof useSession>["data"];
  status: ReturnType<typeof useSession>["status"];
}

// Usar PropsWithChildren es más idiomático en React moderno
type SessionAuthProviderProps = PropsWithChildren<{
  session?: Session | null;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
}>;

type CustomSessionProviderProps = PropsWithChildren;

const SessionContext = createContext<SessionContextType>({
  session: null, // Aquí asumimos que 'session' puede ser 'null' si no hay sesión activa
  status: "unauthenticated", // Un estado predeterminado
});

export const useCustomSession = () => useContext(SessionContext);

// Función componente tipada correctamente
function CustomSessionProvider({ children }: CustomSessionProviderProps) {
  const { data: session, status } = useSession();

  return (
    <SessionContext.Provider value={{ session, status }}>
      {children}
    </SessionContext.Provider>
  );
}

// Función componente con props correctamente tipadas
function SessionAuthProvider({ 
  children,
  session,
  refetchInterval = 0,
  refetchOnWindowFocus = true 
}: SessionAuthProviderProps) {
  return (
    <SessionProvider 
      session={session}
      refetchInterval={refetchInterval}
      refetchOnWindowFocus={refetchOnWindowFocus}
    >
      <CustomSessionProvider>{children}</CustomSessionProvider>
    </SessionProvider>
  );
}

export default SessionAuthProvider;
