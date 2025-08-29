import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrophyIcon } from './TrophyIcon';
import { TrophyType } from '@/common/enum/trophy.enum';

interface TrophyBadgeProps {
  trophyType: TrophyType;
  count: number;
  size?: 'sm' | 'md' | 'lg';
}

export const TrophyBadge: React.FC<TrophyBadgeProps> = ({
  trophyType,
  count,
  size = 'md'
}) => {
  const isChampion = trophyType === TrophyType.Champion;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSize = size === 'sm' ? 14 : size === 'md' ? 16 : 20;

  return (
    <Badge
      variant="outline"
      className={`
        flex items-center gap-2 ${sizeClasses[size]}
        ${isChampion 
          ? 'border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100' 
          : 'border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100'
        }
      `}
    >
      <TrophyIcon trophyType={trophyType} size={iconSize} />
      <span>{count}</span>
    </Badge>
  );
};