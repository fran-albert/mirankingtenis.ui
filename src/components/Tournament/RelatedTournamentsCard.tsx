import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link, ExternalLink } from 'lucide-react';
import { useRelatedTournaments } from '@/hooks/Tournament/useLinkTournament';
import { Tournament } from '@/types/Tournament/Tournament';
import { TournamentType } from '@/common/enum/tournament.enum';

interface RelatedTournamentsCardProps {
  tournament: Tournament;
  onLinkClick?: () => void;
}

export const RelatedTournamentsCard: React.FC<RelatedTournamentsCardProps> = ({
  tournament,
  onLinkClick
}) => {
  const { data: relatedData, isLoading } = useRelatedTournaments(tournament.id);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isMaster = tournament.tournamentType === TournamentType.Master;
  const relatedTournament = relatedData?.relatedTournament;
  const hasRelated = !!relatedTournament;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Link className="h-5 w-5" />
            Vinculación de Torneos
          </CardTitle>
          {!hasRelated && onLinkClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLinkClick}
              className="flex items-center gap-1"
            >
              <Link className="h-4 w-4" />
              Vincular
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">
              Tournament Actual
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isMaster ? 'default' : 'secondary'}>
                {isMaster ? 'Master' : 'Liga'}
              </Badge>
              <span className="font-medium">{tournament.name}</span>
            </div>
          </div>

          {hasRelated ? (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                {isMaster ? 'Liga Vinculada' : 'Master Vinculado'}
              </div>
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <Badge variant={!isMaster ? 'default' : 'secondary'}>
                  {!isMaster ? 'Master' : 'Liga'}
                </Badge>
                <span className="font-medium">{relatedTournament.name}</span>
                <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <div className="text-sm text-gray-600 text-center">
                Sin {isMaster ? 'Liga' : 'Master'} vinculado
              </div>
            </div>
          )}

          {hasRelated && (
            <div className="text-xs text-gray-500">
              Los trofeos del Master se asociarán con la Liga vinculada
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};