export type BookStatus =  'read' | 'reading' | 'want_to_read';

export type SortOption = 'recent' | 'alphabetical' | 'rating';

export interface Book {
  id: number;
  title: string;
  author: string;
  status: BookStatus;
  synopsis?: string;
  coverUrl?: string;
  rating?: number;
  createdAt: number;
}

export interface CreateBookInput {
  title: string;
  author: string;
  synopsis?: string;
  coverUrl?: string;
  status: BookStatus;
  rating?: number;
};

export interface UpdateBookInput {
  id: number;
  title: string;
  author: string;
  synopsis?: string;
  coverUrl?: string;
  rating?: number;
  status: BookStatus;
}

export const BookStatusLabel: Record<BookStatus, string> = {
  read: 'Lido',
  reading: 'Lendo',
  want_to_read: 'Quero ler',
};