import { useEffect } from "react";
import { useCustomSession } from "@/context/SessionAuthProviders";
import { useAuth } from "@/context/AuthProvider";

const AutoSignOut = () => {
  const { status } = useCustomSession();
  const { logout } = useAuth();

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
      }, 5 * 60 * 1000);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("scroll", resetTimer);

    resetTimer();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      clearTimeout(timeoutId);
    };
  }, [status, logout]);

  return null;
};

export default AutoSignOut;
