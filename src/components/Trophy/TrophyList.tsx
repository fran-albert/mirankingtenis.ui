import React from 'react';
import { Trophy } from '@/types/Trophy/Trophy';
import { TrophyCard } from './TrophyCard';
import { TrophyBadge } from './TrophyBadge';
import { TrophyType } from '@/common/enum/trophy.enum';
import { Trophy as TrophyIcon } from 'lucide-react';

interface TrophyListProps {
  trophies: Trophy[];
  showUser?: boolean;
  showStats?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const TrophyList: React.FC<TrophyListProps> = ({
  trophies,
  showUser = false,
  showStats = true,
  emptyMessage = 'No hay trofeos para mostrar',
  className = ''
}) => {
  const championCount = trophies.filter(t => t.trophyType === TrophyType.Champion).length;
  const subChampionCount = trophies.filter(t => t.trophyType === TrophyType.SubChampion).length;

  if (trophies.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="mb-4">
          <TrophyIcon className="mx-auto h-12 w-12 text-gray-400" />
        </div>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={className}>
      {showStats && (
        <div className="flex items-center gap-3 mb-6">
          <div className="text-sm font-medium text-gray-700">
            Trofeos totales: {trophies.length}
          </div>
          {championCount > 0 && (
            <TrophyBadge 
              trophyType={TrophyType.Champion} 
              count={championCount} 
              size="sm"
            />
          )}
          {subChampionCount > 0 && (
            <TrophyBadge 
              trophyType={TrophyType.SubChampion} 
              count={subChampionCount} 
              size="sm"
            />
          )}
        </div>
      )}

      <div className="grid gap-4">
        {trophies.map((trophy) => (
          <TrophyCard
            key={trophy.id}
            trophy={trophy}
            showUser={showUser}
          />
        ))}
      </div>
    </div>
  );
};