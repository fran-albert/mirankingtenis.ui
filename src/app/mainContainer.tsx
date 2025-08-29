"use client";
import { AdminComponent } from "@/components/component/admin-component";
import Navbar from "@/components/navbar";
import TennisAssistantWidget from "@/components/TennisAssistant/TennisAssistantWidget";
import { useAuth } from "@/context/AuthProvider";
import { usePathname } from "next/navigation";

interface MainContainerProps {
  children: React.ReactNode;
}

const MainContainer = ({ children }: MainContainerProps) => {
  const pathname = usePathname();
  const { session, status } = useAuth();
  
  // Don't show widget on login page or when not authenticated
  const shouldShowWidget = status === "authenticated" && 
                           !pathname.includes("/iniciar-sesion") && 
                           !pathname.includes("/restablecer-contraseña") &&
                           !pathname.includes("/nueva-contraseña");

  return (
    <>
      {pathname.startsWith("/admin") ? (
        <div className="flex items-center justify-center h-full">
          <AdminComponent>{children}</AdminComponent>
          {shouldShowWidget && (
            <TennisAssistantWidget 
              userToken={session?.user?.token}
              userId={parseInt(session?.user?.id || "0")}
            />
          )}
        </div>
      ) : (
        <div>
          <Navbar />
          {children}
          {shouldShowWidget && (
            <TennisAssistantWidget 
              userToken={session?.user?.token}
              userId={parseInt(session?.user?.id || "0")}
            />
          )}
        </div>
      )}
    </>
  );
};

export default MainContainer;
