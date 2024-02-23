"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";

interface SessionContextType {
  session: ReturnType<typeof useSession>["data"];
  status: ReturnType<typeof useSession>["status"];
}

interface SessionAuthProviderProps {
  children: React.ReactNode;
}

interface CustomSessionProviderProps {
  children: React.ReactNode;
}

const SessionContext = createContext<SessionContextType>({
  session: null, // Aquí asumimos que 'session' puede ser 'null' si no hay sesión activa
  status: "unauthenticated", // Un estado predeterminado
});

export const useCustomSession = () => useContext(SessionContext);

const CustomSessionProvider: React.FC<CustomSessionProviderProps> = ({
  children,
}) => {
  const { data: session, status } = useSession();

  return (
    <SessionContext.Provider value={{ session, status }}>
      {children}
    </SessionContext.Provider>
  );
};

const SessionAuthProvider: React.FC<SessionAuthProviderProps> = ({
  children,
}) => {
  return (
    <SessionProvider>
      <CustomSessionProvider>{children}</CustomSessionProvider>
    </SessionProvider>
  );
};

export default SessionAuthProvider;
