import React from 'react';
import { Button } from '@/components/ui/button';

interface ResultsPageProps {
  score: 26;
  totalQuestions: 40;
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
            Parabéns por completar o exercício! Observa-se que você identificou com segurança manchetes neutras e manipuladoras, mas houve alguma dificuldade em diferenciar corretamente manchetes sensacionalistas e omissivas. Note que, em alguns casos, sensacionalismo foi confundido com omissão e vice-versa. Para melhorar, procure prestar atenção em sinais de exagero ou dramatização (sensacionalismo) e em informações que foram parcialmente omitidas ou suavizadas (omissão). Reflita sobre cada manchete considerando o que está explícito, o que foi enfatizado e o que pode ter sido deixado de fora. Isso ajudará a afinar seu olhar crítico para diferentes tipos de vieses nas notícias. 
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