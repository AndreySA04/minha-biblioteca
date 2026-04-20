import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import * as BookRepository from '../database/bookRepository';
import { Book, BookStatus, SortOption, CreateBookInput, UpdateBookInput } from '../types/book';

export type BookFilter = BookStatus | 'all';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState<BookFilter>('all');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await BookRepository.getBooks();
      setBooks(data);
    } catch (error) {
      console.error('Erro ao carregar os livros:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [loadBooks])
  );

  const filteredBooks = books.filter((book) => {
    if (filter !== 'all') return book.status === filter;
    return true;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'recent':
      default:
        return b.createdAt - a.createdAt;
    }
  });

  const addBook = useCallback(
    async (newBook: CreateBookInput) => {
      try {
        await BookRepository.createBook(newBook);
        await loadBooks();
      } catch (error) {
        console.error('Erro ao criar livro:', error);
        throw error;
      }
    },
    [loadBooks]
  );

  const editBookDetails = useCallback(
    async (updatedBook: UpdateBookInput) => {
      try {
        await BookRepository.updateBook(updatedBook);
        await loadBooks();
      } catch (error) {
        console.error('Erro ao editar livro:', error);
        throw error;
      }
    },
    [loadBooks]
  );

  const removeBook = useCallback(
    async (id: number) => {
      try {
        await BookRepository.deleteBook(id);
        await loadBooks();
      } catch (error) {
        console.error('Erro ao deletar livro:', error);
      }
    },
    [loadBooks]
  );

  return {
    books: sortedBooks,
    filter,
    sortBy,
    loading,
    setFilter,
    setSortBy,
    reloadBooks: loadBooks,
    addBook,
    editBookDetails,
    removeBook,
  };
}