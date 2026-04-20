import React from 'react';
import { View, Text } from 'react-native';
import { Library, BookOpenText, BookmarkPlus, LucideIcon, Trophy } from 'lucide-react-native';
import { BookFilter } from '../hooks/useBooks'; 
import { useColorScheme } from 'nativewind';

interface EmptyStateProps {
  filter: BookFilter;
}

const MESSAGES: Record<
  BookFilter,
  { Icon: LucideIcon; title: string; subtitle: string }
> = {
  all: {
    Icon: Library,
    title: 'Sua estante está vazia!',
    subtitle: 'Toque no botão + para adicionar seu primeiro livro.',
  },
  reading: {
    Icon: BookOpenText,
    title: 'Nenhuma leitura no momento',
    subtitle: 'Pegue um livro da sua estante e comece sua próxima aventura!',
  },
  want_to_read: {
    Icon: BookmarkPlus,
    title: 'Lista de desejos vazia',
    subtitle: 'Descobriu um livro interessante? Adicione aqui para não esquecer.',
  },
  read: {
    Icon: Trophy,
    title: 'Nenhum livro concluído',
    subtitle: 'Suas conquistas literárias e avaliações aparecerão aqui.',
  },
};

export function EmptyState({ filter }: EmptyStateProps) {
  const { Icon, title, subtitle } = MESSAGES[filter];

  const { colorScheme } = useColorScheme(); 
  const isDark = colorScheme === 'dark';
  
  return (
    <View className="flex-1 items-center justify-center px-10 py-20 bg-slate-50 dark:bg-[#0f172a]">
      <View className="mb-10 text-slate-400 dark:text-slate-700">
        <Icon 
          size={120}           
          strokeWidth={1}       
          color={isDark ? '#f8fafc' : '#1e293b'}
        />
      </View>
      
      <Text className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-3">
        {title}
      </Text>
      
      <Text className="text-base text-slate-500 dark:text-slate-400 text-center leading-6">
        {subtitle}
      </Text>
    </View>
  );
}