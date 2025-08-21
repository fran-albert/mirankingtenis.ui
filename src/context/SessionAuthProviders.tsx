"use client";
import React, { createContext, useContext, PropsWithChildren } from "react";
import { useAuth } from "./AuthProvider";

// Mantener la misma interfaz que antes para compatibilidad total
interface SessionContextType {
  session: ReturnType<typeof useAuth>["session"];
  status: ReturnType<typeof useAuth>["status"];
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  status: "unauthenticated",
});

// Hook que mantiene la misma interfaz que antes
export const useCustomSession = () => useContext(SessionContext);

// Provider que simplemente pasa los datos del AuthProvider
function SessionAuthProvider({ children }: PropsWithChildren) {
  const { session, status } = useAuth();

  return (
    <SessionContext.Provider value={{ session, status }}>
      {children}
    </SessionContext.Provider>
  );
}

export default SessionAuthProvider;