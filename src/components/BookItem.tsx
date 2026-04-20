import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Book, BookStatus, BookStatusLabel } from '../types/book';
import { Star, Pencil, Trash2, Book as BookIcon, ChevronDown, ChevronUp } from 'lucide-react-native';

interface BookItemProps {
  book: Book;
  onDelete: (id: number) => void;
}

function StatusTag({ status }: { status: BookStatus }) {
  let bgClass = '';
  let textClass = '';

  switch (status) {
    case 'read':
      bgClass = 'bg-emerald-100';
      textClass = 'text-emerald-700';
      break;
    case 'reading':
      bgClass = 'bg-blue-100';
      textClass = 'text-blue-700';
      break;
    case 'want_to_read':
      bgClass = 'bg-amber-100';
      textClass = 'text-amber-700';
      break;
  }

  return (
    <View className={`px-2 py-1 rounded-md items-center justify-center ${bgClass}`}>
      <Text className={`text-[10px] font-bold uppercase tracking-wider ${textClass}`}>
        {BookStatusLabel[status]}
      </Text>
    </View>
  );
}

function RatingStars({ rating }: { rating?: number }) {
  if (!rating) return null;

  return (
    <View className="flex-row mt-1.5 gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= Math.floor(rating)) {
          return <Star key={star} size={14} color="#f59e0b" fill="#f59e0b" />;
        } else {
          return <Star key={star} size={14} color="#cbd5e1" fill="transparent" />;
        }
      })}
    </View>
  );
}

export function BookItem({ book, onDelete }: BookItemProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEdit = () => {
    router.push(`/form?id=${book.id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir livro',
      `Tem certeza que deseja remover "${book.title}" da sua estante?\n\nEsta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => onDelete(book.id) },
      ],
    );
  };

  return (
    <View className="bg-white dark:bg-slate-800 rounded-2xl mx-4 mb-3 shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700">
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row p-3 items-center"
      >
        {book.coverUrl ? (
          <Image 
            source={{ uri: book.coverUrl }} 
            className="w-16 h-24 rounded-md bg-slate-200"
            resizeMode="cover"
          />
        ) : (
          <View className="w-16 h-24 rounded-md bg-slate-100 dark:bg-slate-800 items-center justify-center border border-slate-100">
            <BookIcon size={24} color='#94a3b8' strokeWidth={1.5} />
          </View>
        )}

        <View className="flex-1 px-3 justify-center">
          <Text
            className="text-base font-bold text-slate-800 dark:text-slate-100 leading-5"
            numberOfLines={2}
          >
            {book.title}
          </Text>
          <Text 
            className="text-sm text-slate-500 mt-0.5 font-medium" 
            numberOfLines={1}
          >
            {book.author}
          </Text>
        </View>

        <View className="items-end justify-between h-24 py-1 flex-shrink-0">
          <View className="items-end gap-1">
            <StatusTag status={book.status} />
            <RatingStars rating={book.rating} />
          </View>
          
          <View className="mt-auto">
            {isExpanded ? (
               <ChevronUp size={20} color="#94a3b8" />
            ) : (
               <ChevronDown size={20} color="#94a3b8" />
            )}
          </View>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View className="px-3 pb-3 pt-1 border-t border-slate-100">
          {book.synopsis ? (
            <View>
              <Text className="text-sm text-slate-700 dark:text-slate-200 font-bold mt-2">SINOPSE</Text>
              <Text className="text-sm text-slate-500 dark:text-slate-400 leading-5 mb-4 mt-2">
                {book.synopsis}
              </Text>
            </View>
          ) : (
            <Text className="text-sm text-slate-400 italic mb-4 mt-2">
              Nenhuma anotação cadastrada para este livro.
            </Text>
          )}
          <View className="w-full flex-row gap-3 mt-2">
            <TouchableOpacity
              onPress={handleEdit}
              className="flex-1 flex-row items-center justify-center bg-slate-100 py-2 rounded-xl"
            >
              <Pencil size={16} color="#475569" />
              <Text className="text-slate-600 font-semibold ml-2 text-sm">Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              className="flex-1 flex-row items-center justify-center bg-red-50 py-2 rounded-xl"
            >
              <Trash2 size={16} color="#ef4444" />
              <Text className="text-red-500 font-semibold ml-2 text-sm">Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </View>
  );
}