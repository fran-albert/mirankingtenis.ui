"use client";
import { AdminComponent } from "@/components/component/admin-component";
import Navbar from "@/components/navbar";
import { usePathname } from "next/navigation";
interface MainContainerProps {
  children: React.ReactNode;
}

const MainContainer = ({ children }: MainContainerProps) => {
  const pathname = usePathname();
  return (
    <>
      {pathname.startsWith("/admin") ? (
        <div className="flex items-center justify-center h-full">
          <AdminComponent>{children}</AdminComponent>
        </div>
      ) : (
        <div>
          <Navbar />
          {children}
        </div>
      )}
    </>
  );
};

export default MainContainer;
