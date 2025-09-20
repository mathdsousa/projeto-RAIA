import React from 'react';
import { Question } from '@/types/game';

interface QuestionItemProps {
  question: Question;
  isSelected: boolean;
  isConnected: boolean;
  isCorrect?: boolean;
  showResults?: boolean;
  onClick: () => void;
  onMouseEnter: (element: HTMLElement) => void;
  onMouseLeave: () => void;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
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
    return 'border-border hover:bg-game-hover';
  };

  return (
    <div
      className={`
        p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
        ${getStyles()}
      `}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <p className={`text-sm leading-relaxed ${isConnected && !showResults ? 'text-white' : 'text-foreground'}`}>
        {question.phrase}
      </p>
    </div>
  );
};