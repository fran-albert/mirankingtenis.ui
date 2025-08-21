import ActionIcon from "@/components/ui/actionIcon";
import { Button } from "@/components/ui/button";
import { Category } from "@/modules/category/domain/Category";
import { TournamentCategory } from "@/types/Tournament-Category/TournamentCategory";
import { useRouter } from "next/navigation";
import { FaPencilAlt } from "react-icons/fa";

export const Create = ({
  idTournament,
  path,
  category,
  number,
}: {
  idTournament: number;
  category: TournamentCategory;
  path: string;
  number?: number;
}) => {
  const router = useRouter();
  const handleEdit = () => {
    router.push(
      `/${path}/${idTournament}/categoria/${category.id}/nueva-fecha/${number}`
    );
  };

  return (
    <div className="flex justify-start">
      <Button size="sm" variant="outline" onClick={handleEdit}>
        Agregar fecha {number ?? ""}
      </Button>
    </div>
  );
};
