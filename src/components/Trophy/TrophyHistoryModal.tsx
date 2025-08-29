import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TrophyList } from './TrophyList';
import { useUserTrophies } from '@/hooks/Trophy';
import { Trophy as TrophyIcon } from 'lucide-react';

interface TrophyHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
  userName: string;
}

export const TrophyHistoryModal: React.FC<TrophyHistoryModalProps> = ({
  open,
  onOpenChange,
  userId,
  userName
}) => {
  const { data: userTrophies = [], isLoading } = useUserTrophies(userId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrophyIcon className="h-6 w-6 text-yellow-600" />
            Historial de Trofeos - {userName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            </div>
          ) : (
            <TrophyList 
              trophies={userTrophies} 
              showStats={true}
              showUser={false}
              emptyMessage="Este jugador aún no ha ganado ningún trofeo. ¡Participa en torneos Master para obtener tu primer trofeo!"
              className="max-h-[50vh] overflow-y-auto"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};