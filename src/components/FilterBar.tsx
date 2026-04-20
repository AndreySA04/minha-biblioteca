import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Library, BookOpenText, BookmarkPlus, Medal, LucideIcon } from 'lucide-react-native';
import { BookFilter } from '../hooks/useBooks';
import { useColorScheme } from 'nativewind'; 

interface FilterBarProps {
  activeFilter: BookFilter;
  onFilterChange: (filter: BookFilter) => void;
}

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  Icon: LucideIcon;
}

function FilterButton({ label, isActive, onPress, Icon }: FilterButtonProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  let iconColor = '';
  if (isActive) {
    iconColor = '#ffffff';
  } else {
    iconColor = isDark ? '#94a3b8' : '#64748b';
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 items-center py-2 px-0.5 rounded-lg ${
        isActive ? 'bg-slate-600 dark:bg-indigo-700' : 'bg-transparent'
      }`}
      accessibilityLabel={`Filtrar por ${label}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
    >
      <Text
        numberOfLines={1}
        className={`ml-1 text-[11px] font-semibold tracking-tight ${
          isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function FilterBar({
  activeFilter,
  onFilterChange,
}: FilterBarProps) {
  return (
    <View className="flex-row bg-slate-200 dark:bg-slate-900 rounded-xl p-1 mx-4 mb-4 mt-3 border border-transparent dark:border-slate-800">
      <FilterButton
        label="Todos"
        Icon={Library}
        isActive={activeFilter === 'all'}
        onPress={() => onFilterChange('all')}
      />
      <FilterButton
        label="Lendo"
        Icon={BookOpenText}
        isActive={activeFilter === 'reading'}
        onPress={() => onFilterChange('reading')}
      />
      <FilterButton
        label="Quero Ler"
        Icon={BookmarkPlus}
        isActive={activeFilter === 'want_to_read'}
        onPress={() => onFilterChange('want_to_read')}
      />
      <FilterButton
        label="Lidos"
        Icon={Medal}
        isActive={activeFilter === 'read'}
        onPress={() => onFilterChange('read')}
      />
    </View>
  );
}