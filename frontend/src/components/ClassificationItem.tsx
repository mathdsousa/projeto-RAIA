import React from 'react';
import { Classification } from '@/types/game';

interface ClassificationItemProps {
  classification: Classification;
  isSelected: boolean;
  isConnected: boolean;
  isCorrect?: boolean;
  showResults?: boolean;
  onClick: () => void;
  onMouseEnter: (element: HTMLElement) => void;
  onMouseLeave: () => void;
}

export const ClassificationItem: React.FC<ClassificationItemProps> = ({
  classification,
  isSelected,
  isConnected,
  isCorrect,
  showResults = false,
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    onMouseEnter(e.currentTarget);
  };

  const getClassificationColor = () => {
    switch (classification) {
      case 'Neutro':
        return 'border-blue-500 text-blue-700';
      case 'Sensacionalista':
        return 'border-red-500 text-red-700';
      case 'Omissiva':
        return 'border-yellow-500 text-yellow-700';
      case 'Manipuladora':
        return 'border-purple-500 text-purple-700';
      default:
        return 'border-border text-foreground';
    }
  };

  const getStyles = () => {
    if (showResults && isConnected) {
      return isCorrect 
        ? 'bg-green-600 border-green-600 text-white' 
        : 'bg-red-600 border-red-600 text-white';
    }
    if (isConnected && !showResults) {
      return 'bg-black border-black text-white';
    }
    if (isSelected) {
      return 'border-primary bg-primary/5';
    }
    return `border-border hover:bg-game-hover ${getClassificationColor()}`;
  };

  return (
    <div
      className={`
        p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 text-center
        ${getStyles()}
      `}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <p className={`font-medium ${isConnected && !showResults ? 'text-white' : ''}`}>
        {classification}
      </p>
    </div>
  );
};