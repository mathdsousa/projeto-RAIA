export interface Question {
  id: number;
  phrase: string;
  correctAnswer: Classification;
}

export interface Round {
  id: number;
  questions: Question[];
}

export type Classification = 'Neutro' | 'Sensacionalista' | 'Omissiva' | 'Manipuladora';

export interface Connection {
  questionId: number;
  classification: Classification;
  isCorrect?: boolean;
}

export interface GameState {
  currentRound: number;
  connections: Connection[];
  isComplete: boolean;
  score: number;
}

export const CLASSIFICATIONS: Classification[] = ['Neutro', 'Sensacionalista', 'Omissiva', 'Manipuladora'];