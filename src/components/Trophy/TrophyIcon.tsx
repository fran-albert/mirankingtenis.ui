import React from 'react';
import { Trophy as TrophyIconComponent, Award, Medal } from 'lucide-react';
import { TrophyType } from '@/common/enum/trophy.enum';

interface TrophyIconProps {
  trophyType: TrophyType;
  size?: number;
  className?: string;
}

export const TrophyIcon: React.FC<TrophyIconProps> = ({
  trophyType,
  size = 20,
  className = ''
}) => {
  const iconProps = {
    size,
    className: `${className} ${
      trophyType === TrophyType.Champion 
        ? 'text-yellow-500' 
        : 'text-gray-400'
    }`
  };

  if (trophyType === TrophyType.Champion) {
    return <TrophyIconComponent {...iconProps} />;
  }
  
  return <Medal {...iconProps} />;
};