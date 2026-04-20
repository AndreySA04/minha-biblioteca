import '../global.css';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';
import { router, Stack, useRouter } from 'expo-router';
import { getDatabase } from '../src/database/database';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { AlertCircle, BookOpen, CheckCircle2, LibraryBig, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';

const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <View className="w-[90%] mt-2 flex-row items-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 shadow-xl shadow-black/5 dark:shadow-black/20">
      <View className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/30 items-center justify-center">
        <CheckCircle2 size={20} color="#10b981" />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {text1}
        </Text>
        {text2 ? (
          <Text className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 leading-4">
            {text2}
          </Text>
        ) : null}
      </View>
    </View>
  ),

  // 2. Toast de Erro (Vermelho)
  error: ({ text1, text2 }: any) => (
    <View className="w-[90%] mt-2 flex-row items-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 shadow-xl shadow-black/5 dark:shadow-black/20">
      <View className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/30 items-center justify-center">
        <AlertCircle size={20} color="#ef4444" />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {text1}
        </Text>
        {text2 ? (
          <Text className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 leading-4">
            {text2}
          </Text>
        ) : null}
      </View>
    </View>
  ),
};

export default function RootLayout() {
  const [isDbReady, setIsDbReady] = useState(false);

  const { colorScheme } = useColorScheme(); 
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    async function setupDatabase() {
      try {
        await getDatabase();
        setIsDbReady(true);
      } catch (error) {
        console.error('Erro fatal ao iniciar o banco de dados:', error);
      }
    }

    setupDatabase();
  }, []);

  if (!isDbReady) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
        <BookOpen size={48} color={isDark ? '#64748b' : '#94a3b8'} className="mb-4" />
        <ActivityIndicator size="large" color={isDark ? '#cbd5e1' : '#334155'} />
        <Text className="mt-4 text-slate-500 dark:text-slate-400 font-medium">
          Preparando sua estante...
        </Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? '#0f172a' : '#f8fafc',
          },
          headerTintColor: isDark ? '#f8fafc' : '#1e293b',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: {
            backgroundColor: isDark ? '#0f172a' : '#f8fafc',
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            headerTitle: () => (
              <View className="flex-row items-center py-3">
                <LibraryBig size={28} color={isDark ? '#f8fafc' : '#1e293b'} strokeWidth={2.5} />
                <Text className="ml-2 text-2xl font-bold text-slate-800 dark:text-slate-50">
                  Minha Biblioteca
                </Text>
              </View>
            ),
            headerRight: () => (
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => router.push('/form')}
                className="w-10 h-10 rounded-full overflow-hidden"
              >
                <LinearGradient
                  colors={!isDark ? ['#64748b', '#566475', '#475569'] : ['#2453ff', '#7157c7', '#34088c']}
                  locations={[0, 0.5, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="flex-1 items-center justify-center"
                >
                  <Plus size={24} color="#ffffff" strokeWidth={2.5} />
                </LinearGradient>
              </TouchableOpacity>
            ),
          }} 
        />
        <Stack.Screen 
          name="form" 
          options={{ 
            title: 'Novo Livro',
            presentation: 'modal', 
          }} 
        />
      </Stack>

      <Toast config={toastConfig} />
    </ThemeProvider>
  );
}