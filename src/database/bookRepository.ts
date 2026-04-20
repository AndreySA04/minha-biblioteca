import { getDatabase } from './database';
import { Book, BookStatus, CreateBookInput, UpdateBookInput } from '../types/book';

export async function getBooks(statusFilter?: BookStatus): Promise<Book[]> {
  const db = await getDatabase();
  
  if (statusFilter) {
    return db.getAllAsync<Book>(
      'SELECT * FROM books WHERE status = ? ORDER BY createdAt DESC', 
      [statusFilter]
    );
  }
  
  return db.getAllAsync<Book>('SELECT * FROM books ORDER BY createdAt DESC');
}

export async function getBookById(id: number): Promise<Book | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Book>('SELECT * FROM books WHERE id = ?', [id]);
}

export async function createBook(input: CreateBookInput): Promise<Book> {
  const db = await getDatabase();
  const createdAt = Date.now(); 
  
  const result = await db.runAsync(
    `INSERT INTO books (title, author, synopsis, coverUrl, status, rating, createdAt) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      input.title,
      input.author,
      input.synopsis || '',
      input.coverUrl || '',
      input.status,
      input.rating || null,
      createdAt
    ]
  );
  
  return (await getBookById(result.lastInsertRowId))!;
}

export async function updateBook(input: UpdateBookInput): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE books 
     SET title = ?, author = ?, synopsis = ?, coverUrl = ? 
     WHERE id = ?`,
    [
      input.title,
      input.author,
      input.synopsis || null,
      input.coverUrl || null,
      input.id
    ]
  );
}

export async function updateBookStatus(
  id: number,
  status: BookStatus
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE books SET status = ? WHERE id = ?',
    [status, id]
  );
}

export async function updateBookRating(id: number, rating: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE books SET rating = ? WHERE id = ?',
    [rating, id]
  );
}

export async function deleteBook(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM books WHERE id = ?', [id]);
}