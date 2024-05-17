import { AdminComponent } from "@/components/component/admin-component";
import { useRouter } from "next/router";
import CourtPage from "../canchas/page";

const AdminSubpathPage: React.FC = () => {
  const router = useRouter();
  const { subpath } = router.query;

  let SubComponent: JSX.Element | null = null;

  switch (subpath?.[0]) {
    case "canchas":
      SubComponent = <CourtPage />;
      break;
    default:
      SubComponent = <div>Subruta no encontrada</div>;
  }

  return <AdminComponent>{SubComponent}</AdminComponent>;
};

export default AdminSubpathPage;
