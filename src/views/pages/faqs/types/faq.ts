import { ReactNode } from 'react';

export interface Question {
  id: string;
  title: string;
  content: ReactNode;
}

export interface FAQ_Category {
  id: string;
  title: string;
  questions: Question[];
}
