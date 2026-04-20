import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Modal,
  Pressable
} from 'react-native';
import { useBooks } from '../src/hooks/useBooks';
import { BookItem } from '../src/components/BookItem';
import { FilterBar } from '../src/components/FilterBar';
import { EmptyState } from '../src/components/EmptyState';
import { ArrowDownUp, Check, Star, Clock, Type } from 'lucide-react-native';
import { SortOption } from '../src/types/book';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';
import Toast from 'react-native-toast-message';

const HomeScreen = () => {
  const {
    books,
    filter,
    sortBy,
    loading,
    setFilter,
    setSortBy,
    removeBook,
  } = useBooks();

  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const { colorScheme } = useColorScheme(); 
  const isDark = colorScheme === 'dark';

  if (loading && books.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="mt-3 text-slate-500 dark:text-slate-400 text-sm">
          Carregando sua biblioteca...
        </Text>
      </View>
    );
  }

  const handleSelectSort = (option: SortOption) => {
    setSortBy(option);
    setIsSortMenuOpen(false);
  };

  const handleDeleteBook = (id: number) => {
    removeBook(id);
    
    Toast.show({
      type: 'success',
      text1: 'Livro Excluído',
      text2: 'O livro foi removido da sua estante.',
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-[#0f172a] relative">
      <FilterBar
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      <FlatList
        data={books}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <BookItem book={item} onDelete={handleDeleteBook} />
        )}
        ListEmptyComponent={<EmptyState filter={filter} />}
        contentContainerStyle={
          books.length === 0
            ? { flexGrow: 1 }
            : { paddingVertical: 4, paddingBottom: 100 }
        }
        showsVerticalScrollIndicator={false}
      />

      {books.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsSortMenuOpen(true)}
          className="absolute bottom-8 right-6 w-16 h-16 rounded-full overflow-hidden shadow-lg"
          accessibilityLabel="Ordenar livros"
          accessibilityRole="button"
        >
          <LinearGradient
            colors={!isDark ? ['#64748b', '#566475', '#475569'] : ['#2453ff', '#7157c7', '#34088c']}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1 items-center justify-center"
          >
            <ArrowDownUp size={26} color="#ffffff" strokeWidth={2.5} />
          </LinearGradient>
        </TouchableOpacity>
      )}

      <Modal
        visible={isSortMenuOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsSortMenuOpen(false)}
      >
        <Pressable 
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setIsSortMenuOpen(false)}
        >
          <Pressable 
            className="bg-white dark:bg-slate-900 rounded-t-3xl p-6 pb-10"
          >
            <Text className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">
              Ordenar por
            </Text>

            {/* Opção 1: Recentes */}
            <TouchableOpacity 
              className="flex-row items-center py-4 border-b border-slate-100 dark:border-slate-800"
              onPress={() => handleSelectSort('recent')}
            >
              <Clock size={20} color={sortBy === 'recent' ? '#4f46e5' : '#64748b'} />
              <Text className={`flex-1 text-base ml-3 ${sortBy === 'recent' ? 'font-bold text-indigo-600' : 'text-slate-700 dark:text-slate-300'}`}>
                Adicionados Recentemente
              </Text>
              {sortBy === 'recent' && <Check size={20} color="#4f46e5" />}
            </TouchableOpacity>

            {/* Opção 2: Alfabética */}
            <TouchableOpacity 
              className="flex-row items-center py-4 border-b border-slate-100 dark:border-slate-800"
              onPress={() => handleSelectSort('alphabetical')}
            >
              <Type size={20} color={sortBy === 'alphabetical' ? '#4f46e5' : '#64748b'} />
              <Text className={`flex-1 text-base ml-3 ${sortBy === 'alphabetical' ? 'font-bold text-indigo-600' : 'text-slate-700 dark:text-slate-300'}`}>
                Ordem Alfabética (A-Z)
              </Text>
              {sortBy === 'alphabetical' && <Check size={20} color="#4f46e5" />}
            </TouchableOpacity>

            {/* Opção 3: Avaliação */}
            <TouchableOpacity 
              className="flex-row items-center py-4"
              onPress={() => handleSelectSort('rating')}
            >
              <Star size={20} color={sortBy === 'rating' ? '#4f46e5' : '#64748b'} />
              <Text className={`flex-1 text-base ml-3 ${sortBy === 'rating' ? 'font-bold text-indigo-600' : 'text-slate-700 dark:text-slate-300'}`}>
                Melhor Avaliação
              </Text>
              {sortBy === 'rating' && <Check size={20} color="#4f46e5" />}
            </TouchableOpacity>

          </Pressable>
        </Pressable>
      </Modal>

    </View>
  );
};

export default HomeScreen;