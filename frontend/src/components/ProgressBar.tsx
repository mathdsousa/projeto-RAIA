import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground">
          Questão {current} de {total}
        </span>
        <span className="text-sm text-muted-foreground">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full bg-progress-bg rounded-full h-3">
        <div
          className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};