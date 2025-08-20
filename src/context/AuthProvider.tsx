"use client";
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from "react";
import axiosInstance from "@/services/axiosConfig";
import { toast } from "sonner";

// Tipos compatibles con Next-Auth
interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  roles: string[];
  photo?: string;
  token: string;
}

interface AuthContextType {
  session: { user: User } | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Función para decodificar JWT (igual que en auth.config.ts)
function decodeJWT(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    const payload = parts[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    return decoded;
  } catch (error) {
    return null;
  }
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  status: "unauthenticated",
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<{ user: User } | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  // Verificar token al cargar la app
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        setStatus("unauthenticated");
        return;
      }

      try {
        const decoded = decodeJWT(token);
        
        if (!decoded) {
          localStorage.removeItem("auth_token");
          setStatus("unauthenticated");
          return;
        }

        // Verificar si el token expiró
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          localStorage.removeItem("auth_token");
          setStatus("unauthenticated");
          return;
        }

        const user: User = {
          id: decoded.id,
          name: decoded.name || "",
          lastname: decoded.lastname || "",
          email: decoded.email || "",
          roles: decoded.roles || [],
          photo: localStorage.getItem("user_photo") || undefined,
          token: token,
        };

        setSession({ user });
        setStatus("authenticated");
        
        // Configurar token en axios
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
      } catch (error) {
        console.error("Error verificando token:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_photo");
        setStatus("unauthenticated");
      }
    };

    checkToken();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setStatus("loading");
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.error || !response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      const decoded = decodeJWT(data.token);
      
      if (!decoded) {
        throw new Error("Error al decodificar el token");
      }

      const user: User = {
        id: decoded.id,
        name: decoded.name || "",
        lastname: decoded.lastname || "",
        email: data.email || email,
        roles: decoded.roles || [],
        photo: data.photo,
        token: data.token,
      };

      // Guardar en localStorage
      localStorage.setItem("auth_token", data.token);
      if (data.photo) {
        localStorage.setItem("user_photo", data.photo);
      }

      // También guardar en cookies para el middleware (opcional)
      document.cookie = `auth_token=${data.token}; path=/; secure; samesite=strict`;

      // Configurar token en axios
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      setSession({ user });
      setStatus("authenticated");
      
      toast.success("Sesión iniciada correctamente");
      
    } catch (error: any) {
      setStatus("unauthenticated");
      toast.error(error.message || "Error al iniciar sesión");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_photo");
    // Limpiar cookie
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    delete axiosInstance.defaults.headers.common['Authorization'];
    setSession(null);
    setStatus("unauthenticated");
    toast.success("Sesión cerrada");
  };

  return (
    <AuthContext.Provider value={{ session, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}