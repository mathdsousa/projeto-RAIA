import React, { useState } from 'react';
import { GameQuiz } from '@/components/GameQuiz';
import { ResultsPage } from '@/components/ResultsPage';
import { Button } from '@/components/ui/button';

type GameScreen = 'start' | 'playing' | 'results';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('start');
  const [finalScore, setFinalScore] = useState(0);

  const handleStartGame = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/start', {
        method: 'POST',
      });
      
      const data = await response.json();

      console.log('Jogo iniciado:', data);
      
      // Salvar o game_id na sessionStorage
      if (data.game_id) {
        sessionStorage.setItem('game_id', data.game_id);
      }
      
      setCurrentScreen('playing');
    } catch (error) {
      console.error('Erro ao iniciar jogo:', error);
      // Se der erro, inicia o jogo mesmo assim (fallback)
      setCurrentScreen('playing');
    }
  };

  const handleGameComplete = (score: number) => {
    setFinalScore(score);
    setCurrentScreen('results');
  };

  const handleRestart = () => {
    setFinalScore(0);
    setCurrentScreen('start');
  };

  if (currentScreen === 'playing') {
    return (
      <div className="min-h-screen bg-background py-8">
        <GameQuiz onGameComplete={handleGameComplete} />
      </div>
    );
  }

  if (currentScreen === 'results') {
    return (
      <div className="min-h-screen bg-background py-8 flex items-center justify-center">
        <ResultsPage 
          score={finalScore} 
          totalQuestions={10} 
          onRestart={handleRestart} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-card rounded-2xl p-8 shadow-lg">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Quiz de Classificação de Mídia
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Teste sua habilidade de identificar diferentes tipos de linguagem jornalística. 
            Conecte as frases com suas classificações correspondentes: 
            <strong> Neutro, Sensacionalista, Omissiva ou Manipuladora</strong>.
          </p>

          <div className="bg-game-surface rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Como Jogar</h2>
            <div className="text-left space-y-2 text-muted-foreground">
              <p>• Leia as frases na coluna da esquerda</p>
              <p>• Clique em uma frase e depois na classificação correspondente</p>
              <p>• Linhas visuais conectarão suas escolhas</p>
              <p>• Complete todas as conexões para avançar</p>
              <p>• São 10 questões divididas em 3 rodadas</p>
            </div>
          </div>

          <Button
            onClick={handleStartGame}
            size="lg"
            className="px-12 py-3 text-lg"
          >
            Começar Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;