import React from 'react';
import { Button } from '@/components/ui/button';

interface ResultsPageProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ score, totalQuestions, onRestart }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getScoreMessage = () => {
    if (percentage >= 90) return { message: "Excelente!", emoji: "🎉", color: "text-green-600" };
    if (percentage >= 70) return { message: "Muito Bom!", emoji: "👏", color: "text-blue-600" };
    if (percentage >= 50) return { message: "Bom Trabalho!", emoji: "👍", color: "text-yellow-600" };
    return { message: "Continue Praticando!", emoji: "💪", color: "text-orange-600" };
  };

  const scoreData = getScoreMessage();

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className="bg-card rounded-2xl p-8 shadow-lg">
        <div className="text-6xl mb-4">{scoreData.emoji}</div>
        
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Quiz Concluído!
        </h1>
        
        <h2 className={`text-2xl font-semibold mb-6 ${scoreData.color}`}>
          {scoreData.message}
        </h2>

        <div className="bg-game-surface rounded-xl p-6 mb-8">
          <div className="text-5xl font-bold text-primary mb-2">
            {score}/{totalQuestions}
          </div>
          <div className="text-lg text-muted-foreground mb-4">
            Respostas Corretas
          </div>
          <div className="text-3xl font-semibold text-foreground">
            {percentage}%
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Você demonstrou {percentage >= 70 ? 'uma excelente' : percentage >= 50 ? 'uma boa' : 'alguma'} 
            {' '}capacidade de identificar diferentes tipos de linguagem na mídia. 
            {percentage < 70 && ' Continue praticando para melhorar ainda mais!'}
          </p>
          
          <Button
            onClick={onRestart}
            size="lg"
            className="px-8"
          >
            Jogar Novamente
          </Button>
        </div>
      </div>
    </div>
  );
};