import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Question, Classification, Connection, GameState, CLASSIFICATIONS } from '@/types/game';
import { QUIZ_ROUNDS } from '@/data/questions';
import { ProgressBar } from './ProgressBar';
import { QuestionItem } from './QuestionItem';
import { ClassificationItem } from './ClassificationItem';
import { Button } from '@/components/ui/button';

interface GameQuizProps {
  onGameComplete: (score: number) => void;
}

export const GameQuiz: React.FC<GameQuizProps> = ({ onGameComplete }) => {
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 0,
    connections: [],
    isComplete: false,
    score: 0
  });

  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [selectedClassification, setSelectedClassification] = useState<Classification | null>(null);
  const [currentConnections, setCurrentConnections] = useState<Connection[]>([]);
  const [hoveredElements, setHoveredElements] = useState<{question?: HTMLElement, classification?: HTMLElement}>({});
  const [showResults, setShowResults] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentRound = QUIZ_ROUNDS[gameState.currentRound];
  const currentQuestions = currentRound ? currentRound.questions : [];

  const drawConnection = useCallback((from: HTMLElement, to: HTMLElement, isTemporary = false) => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    // Ajustar o tamanho do canvas
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar conexões existentes
    currentConnections.forEach(connection => {
      const questionEl = document.querySelector(`[data-question-id="${connection.questionId}"]`) as HTMLElement;
      const classificationEl = document.querySelector(`[data-classification="${connection.classification}"]`) as HTMLElement;
      
      if (questionEl && classificationEl) {
        drawSingleConnection(ctx, questionEl, classificationEl, containerRect, false);
      }
    });

    // Desenhar conexão temporária se aplicável
    if (isTemporary) {
      drawSingleConnection(ctx, from, to, containerRect, true);
    }
  }, [currentConnections]);

  const drawSingleConnection = (
    ctx: CanvasRenderingContext2D,
    from: HTMLElement,
    to: HTMLElement,
    containerRect: DOMRect,
    isTemporary: boolean
  ) => {
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();

    const startX = fromRect.right - containerRect.left;
    const startY = fromRect.top - containerRect.top + fromRect.height / 2;
    const endX = toRect.left - containerRect.left;
    const endY = toRect.top - containerRect.top + toRect.height / 2;

    ctx.strokeStyle = isTemporary ? '#666' : '#333';
    ctx.lineWidth = isTemporary ? 2 : 3;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    
    // Curva suave
    const controlX1 = startX + (endX - startX) * 0.5;
    const controlY1 = startY;
    const controlX2 = startX + (endX - startX) * 0.5;
    const controlY2 = endY;
    
    ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
    ctx.stroke();

    // Desenhar círculos nas extremidades
    ctx.fillStyle = isTemporary ? '#666' : '#333';
    ctx.beginPath();
    ctx.arc(startX, startY, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(endX, endY, 4, 0, 2 * Math.PI);
    ctx.fill();
  };

  const handleQuestionClick = (questionId: number) => {
    setSelectedQuestion(questionId);
    if (selectedClassification) {
      createConnection(questionId, selectedClassification);
    }
  };

  const handleClassificationClick = (classification: Classification) => {
    setSelectedClassification(classification);
    if (selectedQuestion) {
      createConnection(selectedQuestion, classification);
    }
  };

  const createConnection = (questionId: number, classification: Classification) => {
    // Remove existing connections for both question and classification to ensure 1:1 mapping
    const existingQuestionIndex = currentConnections.findIndex(c => c.questionId === questionId);
    const existingClassificationIndex = currentConnections.findIndex(c => c.classification === classification);
    
    let newConnections = currentConnections.filter(c => 
      c.questionId !== questionId && c.classification !== classification
    );
    
    newConnections.push({ questionId, classification });
    
    setCurrentConnections(newConnections);
    setSelectedQuestion(null);
    setSelectedClassification(null);
  };

  const handleNext = () => {
    if (currentConnections.length < 4) return;

    if (!showResults) {
      // Primeira vez clicando - mostrar resultados
      const connectionsWithResults = currentConnections.map(connection => {
        const question = currentQuestions.find(q => q.id === connection.questionId);
        const isCorrect = question && question.correctAnswer === connection.classification;
        return { ...connection, isCorrect };
      });
      
      setCurrentConnections(connectionsWithResults);
      setShowResults(true);
    } else {
      // Segunda vez clicando - ir para próxima rodada
      const correctAnswers = currentConnections.filter(c => c.isCorrect).length;
      const newScore = gameState.score + correctAnswers;
      
      if (gameState.currentRound >= 9) {
        // Fim do jogo (10 rodadas)
        onGameComplete(newScore);
      } else {
        setGameState({
          currentRound: gameState.currentRound + 1,
          connections: [...gameState.connections, ...currentConnections],
          isComplete: false,
          score: newScore
        });
        setCurrentConnections([]);
        setShowResults(false);
      }
    }
  };

  const handleQuestionHover = (element: HTMLElement) => {
    setHoveredElements(prev => ({ ...prev, question: element }));
  };

  const handleClassificationHover = (element: HTMLElement) => {
    setHoveredElements(prev => ({ ...prev, classification: element }));
  };

  const handleMouseLeave = () => {
    setHoveredElements({});
  };

  // Efeito para desenhar conexão temporária durante hover
  useEffect(() => {
    if (hoveredElements.question && hoveredElements.classification) {
      drawConnection(hoveredElements.question, hoveredElements.classification, true);
    }
  }, [hoveredElements, drawConnection]);

  // Redesenhar conexões quando mudarem
  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      
      if (currentConnections.length > 0) {
        setTimeout(() => {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            currentConnections.forEach(connection => {
              const questionEl = document.querySelector(`[data-question-id="${connection.questionId}"]`) as HTMLElement;
              const classificationEl = document.querySelector(`[data-classification="${connection.classification}"]`) as HTMLElement;
              
              if (questionEl && classificationEl) {
                drawSingleConnection(ctx, questionEl, classificationEl, container.getBoundingClientRect(), false);
              }
            });
          }
        }, 100);
      }
    }
  }, [currentConnections]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ProgressBar 
        current={gameState.currentRound + 1} 
        total={10} 
      />
      
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Rodada {gameState.currentRound + 1} de 10
        </h2>
        <p className="text-muted-foreground">
          Conecte as frases à esquerda com suas classificações à direita
        </p>
      </div>

      <div ref={containerRef} className="relative grid grid-cols-2 gap-8 min-h-[500px]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-10"
          style={{ width: '100%', height: '100%' }}
        />
        
        {/* Frases à esquerda */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Frases</h3>
          {currentQuestions.map(question => (
            <div key={question.id} data-question-id={question.id}>
              <QuestionItem
                question={question}
                isSelected={selectedQuestion === question.id}
                isConnected={currentConnections.some(c => c.questionId === question.id)}
                isCorrect={currentConnections.find(c => c.questionId === question.id)?.isCorrect}
                showResults={showResults}
                onClick={() => handleQuestionClick(question.id)}
                onMouseEnter={handleQuestionHover}
                onMouseLeave={handleMouseLeave}
              />
            </div>
          ))}
        </div>

        {/* Classificações à direita */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Classificações</h3>
          {CLASSIFICATIONS.map(classification => (
            <div key={classification} data-classification={classification}>
              <ClassificationItem
                classification={classification}
                isSelected={selectedClassification === classification}
                isConnected={currentConnections.some(c => c.classification === classification)}
                isCorrect={currentConnections.find(c => c.classification === classification)?.isCorrect}
                showResults={showResults}
                onClick={() => handleClassificationClick(classification)}
                onMouseEnter={handleClassificationHover}
                onMouseLeave={handleMouseLeave}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={handleNext}
          disabled={currentConnections.length < 4}
          size="lg"
          className="px-8"
        >
          {showResults ? 
            (gameState.currentRound >= 9 ? 'Finalizar Quiz' : 'Próxima Rodada') :
            'Ver Resultados'
          }
        </Button>
      </div>
    </div>
  );
};