import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrophyIcon } from './TrophyIcon';
import { Trophy } from '@/types/Trophy/Trophy';
import { TrophyType } from '@/common/enum/trophy.enum';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TrophyCardProps {
  trophy: Trophy;
  showUser?: boolean;
  className?: string;
}

export const TrophyCard: React.FC<TrophyCardProps> = ({
  trophy,
  showUser = false,
  className = ''
}) => {
  const isChampion = trophy.trophyType === TrophyType.Champion;
  const formattedDate = format(new Date(trophy.dateWon), 'dd MMM yyyy', { locale: es });

  return (
    <Card className={`transition-all hover:shadow-md ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`
            p-3 rounded-full
            ${isChampion 
              ? 'bg-yellow-100 ring-2 ring-yellow-200' 
              : 'bg-gray-100 ring-2 ring-gray-200'
            }
          `}>
            <TrophyIcon trophyType={trophy.trophyType} size={24} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900 truncate">
                  {trophy.name}
                </h3>
                {trophy.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {trophy.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={isChampion ? 'default' : 'secondary'}>
                    {isChampion ? 'Campeón' : 'SubCampeón'}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>

            {trophy.tournamentCategory && (
              <div className="mt-2">
                <span className="text-xs text-gray-500">
                  {trophy.tournamentCategory.name}
                </span>
              </div>
            )}

            {showUser && trophy.user && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">{trophy.user.name}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};