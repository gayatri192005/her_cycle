import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getCyclePhaseDescription } from '@/utils/cycleInsights';

interface CyclePhaseIndicatorProps {
  dayOfCycle: number;
  averageCycleLength: number;
  isFertileDay: boolean;
}

const CyclePhaseIndicator: React.FC<CyclePhaseIndicatorProps> = ({ 
  dayOfCycle, 
  averageCycleLength, 
  isFertileDay 
}) => {
  const phaseInfo = getCyclePhaseDescription(dayOfCycle, averageCycleLength);
  
  // Determine phase color
  const getPhaseColor = () => {
    switch (phaseInfo.phase) {
      case 'Menstrual Phase':
        return 'bg-hercycle-deepPink';
      case 'Follicular Phase':
        return 'bg-hercycle-pink/60';
      case 'Ovulatory Phase':
        return 'bg-blue-400';
      case 'Luteal Phase':
        return 'bg-purple-400';
      default:
        return 'bg-gray-300';
    }
  };

  // Get phase abbreviation
  const getPhaseAbbreviation = () => {
    switch (phaseInfo.phase) {
      case 'Menstrual Phase':
        return 'M';
      case 'Follicular Phase':
        return 'F';
      case 'Ovulatory Phase':
        return 'O';
      case 'Luteal Phase':
        return 'L';
      default:
        return '?';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            <div 
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${getPhaseColor()}`}
            >
              {getPhaseAbbreviation()}
            </div>
            {isFertileDay && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-white"></div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold">{phaseInfo.phase}</p>
            <p className="text-xs">{phaseInfo.description}</p>
            {isFertileDay && (
              <p className="text-xs font-medium text-blue-500">Potentially fertile day</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CyclePhaseIndicator; 