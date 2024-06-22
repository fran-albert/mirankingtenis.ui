import { AdminComponent } from "@/components/component/admin-component";
import { useParams } from "next/navigation";
import CourtPage from "../canchas/page";

const AdminSubpathPage: React.FC = () => {
  const params = useParams();
  const subpath = params?.subpath;

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
