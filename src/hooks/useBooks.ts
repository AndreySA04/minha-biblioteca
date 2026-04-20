import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import * as BookRepository from '../database/bookRepository';
import { Book, BookStatus, CreateBookInput, UpdateBookInput } from '../types/book';

export type BookFilter = BookStatus | 'all';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState<BookFilter>('all');
  const [loading, setLoading] = useState(true);

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

  const changeBookStatus = useCallback(
    async (id: number, newStatus: BookStatus) => {
      try {
        await BookRepository.updateBookStatus(id, newStatus);
        await loadBooks();
      } catch (error) {
        console.error('Erro ao atualizar status:', error);
      }
    },
    [loadBooks]
  );

  const changeBookRating = useCallback(
    async (id: number, newRating: number) => {
      try {
        await BookRepository.updateBookRating(id, newRating);
        await loadBooks();
      } catch (error) {
        console.error('Erro ao atualizar status:', error);
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

  const readCount = books.filter((b) => b.status === 'read').length;
  const readingCount = books.filter((b) => b.status === 'reading').length;
  const wantToReadCount = books.filter((b) => b.status === 'want_to_read').length;

  return {
    books: filteredBooks,
    filter,
    loading,
    allBooksCount: books.length,
    readCount,
    readingCount,
    wantToReadCount,
    setFilter,
    reloadBooks: loadBooks,
    addBook,
    editBookDetails,
    changeBookStatus,
    removeBook,
  };
}