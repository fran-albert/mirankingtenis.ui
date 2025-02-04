import { Role } from "@/common/enum/role.enum";
import { useCustomSession } from "@/context/SessionAuthProviders";

const useRoles = () => {
  const { session } = useCustomSession();

  const isPlayer = session?.user?.roles?.includes(Role.JUGADOR);
  const isAdmin = session?.user?.roles?.includes(Role.ADMINISTRADOR);
  const isUserLoggedIn = !!session?.user?.id;

  return { isPlayer, isAdmin, session, isUserLoggedIn };
};

export default useRoles;
