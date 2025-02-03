import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DoublesExhibitionMatchResponse } from "@/types/Double-Match/DoublesExhibitionMatch";
import { useDoubleMatchMutations } from "@/hooks/Doubles-Express/useDoubleMatchMutation";

interface DeleteMatchDialogProps {
  open: boolean;
  onClose: () => void;
  doubleMatch: DoublesExhibitionMatchResponse;
}

export const DeleteDoubleMatchDialog: React.FC<DeleteMatchDialogProps> = ({
  open,
  onClose,
  doubleMatch,
}) => {
  const { deleteDoubleMatchFn } = useDoubleMatchMutations();

  const onSubmit = async () => {
    toast.promise(
      deleteDoubleMatchFn.mutateAsync({
        matchId: doubleMatch.id,
      }),
      {
        loading: "Eliminando partido...",
        success: "Partido elimindo con éxito!",
        error: "Error al eliminar el partido.",
      }
    );

    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres eliminar el partido? Esta acción no se
            puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onSubmit}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
