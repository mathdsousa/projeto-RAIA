export interface Question {
  id: number;
  phrase: string;
  correctAnswer: Classification;
}

export interface Round {
  id: number;
  fact: string;
  questions: Question[];
}

export interface GameState {
  currentRound: number;
  connections: Connection[];
  isComplete: boolean;
  score: number;
  allAnswers: { [round: number]: { [correct: string]: string } }; // Novo campo
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

// Função para converter a classificação da API para o formato do frontend
export const convertClassificationFromAPI = (apiClassification: string): Classification => {
  const lowerCase = apiClassification.toLowerCase();
  switch (lowerCase) {
    case 'neutra': return 'Neutro';
    case 'sensacionalista': return 'Sensacionalista';
    case 'omissiva': return 'Omissiva';
    case 'manipuladora': return 'Manipuladora';
    default: return 'Neutro'; // fallback
  }
};

// Função para converter a classificação do frontend para a API
export const convertClassificationToAPI = (classification: Classification): string => {
  switch (classification) {
    case 'Neutro': return 'neutra';
    case 'Sensacionalista': return 'sensacionalista';
    case 'Omissiva': return 'omissiva';
    case 'Manipuladora': return 'manipuladora';
    default: return 'neutra';
  }
};

// Função para mapear as abreviações usadas no formato de resposta
export const getClassificationKey = (classification: string): string => {
  const lowerCase = classification.toLowerCase();
  switch (lowerCase) {
    case 'neutra': return 'neutra';
    case 'sensacionalista': return 'sens';
    case 'omissiva': return 'omis';
    case 'manipuladora': return 'manip';
    default: return classification;
  }
};