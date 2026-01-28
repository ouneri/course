export type QuizItem = {
  id: number;
  type: 'select';
  options: string[];
};

export interface Quizinterface {
  id: number;
  title: string;
  description: string;
  items: QuizItem[];
}
