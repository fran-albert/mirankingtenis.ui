import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

const AutoSignOut = () => {
  const { status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        signOut();
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
  }, [status]);

  return null;
};

export default AutoSignOut;
