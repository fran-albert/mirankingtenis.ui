import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useLinkTournament } from '@/hooks/Tournament/useLinkTournament';
import { Tournament } from '@/types/Tournament/Tournament';

interface LinkTournamentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  masterTournament: Tournament;
  ligaTournaments: Tournament[];
}

export const LinkTournamentDialog: React.FC<LinkTournamentDialogProps> = ({
  open,
  onOpenChange,
  masterTournament,
  ligaTournaments
}) => {
  const [selectedLigaId, setSelectedLigaId] = useState<string>('');
  const linkMutation = useLinkTournament();

  const handleSubmit = () => {
    if (!selectedLigaId) return;

    linkMutation.mutate({
      masterId: masterTournament.id,
      request: {
        leagueId: parseInt(selectedLigaId)
      }
    }, {
      onSuccess: () => {
        onOpenChange(false);
        setSelectedLigaId('');
      }
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedLigaId('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Vincular Master a Liga
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Master Tournament
            </Label>
            <div className="mt-1 p-2 bg-gray-50 rounded-md">
              <span className="font-medium">{masterTournament.name}</span>
            </div>
          </div>

          <div>
            <Label htmlFor="liga-select" className="text-sm font-medium text-gray-700">
              Seleccionar Liga
            </Label>
            <Select value={selectedLigaId} onValueChange={setSelectedLigaId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona una liga..." />
              </SelectTrigger>
              <SelectContent>
                {ligaTournaments.map((liga) => (
                  <SelectItem key={liga.id} value={liga.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{liga.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={linkMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedLigaId || linkMutation.isPending}
          >
            {linkMutation.isPending ? 'Vinculando...' : 'Vincular'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};