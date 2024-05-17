import ActionIcon from "@/components/ui/actionIcon";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaPencilAlt } from "react-icons/fa";

export const ViewButton = ({ id, path }: { id?: number; path?: string }) => {
  const router = useRouter();
  const handleEdit = () => {
    router.push(`/${path}/${id}`);
  };

  return (
    <div className="flex justify-center">
      <Button size="sm" variant="outline" onClick={handleEdit}>
        Ver
      </Button>
    </div>
  );
};
