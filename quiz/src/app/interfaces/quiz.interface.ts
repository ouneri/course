export interface Answer {
  id: number | string;
  text: string;
  correct: boolean;
}

export interface Question {
  id: number | string;
  title: string;
  answer: Answer[];
}

export interface Quizinterface {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}
