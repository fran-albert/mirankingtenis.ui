import ActionIcon from "@/components/ui/actionIcon";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaPencilAlt } from "react-icons/fa";

export const EditButton = ({ id, path }: { id: number; path: string }) => {
  const router = useRouter();
  const handleEdit = () => {
    router.push(`/${path}/${id}`);
  };

  return (
    <div className="flex justify-center">
      <button onClick={handleEdit} className="m-2">
        <ActionIcon
          icon={<FaPencilAlt size={20} />}
          tooltip="Editar"
          color="text-gray-600"
        />
      </button>
    </div>
  );
};
