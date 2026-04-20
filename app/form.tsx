import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle2, ImageIcon, PlusCircle, Save, Star, Trash2 } from 'lucide-react-native';

import { File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import { useBooks } from '../src/hooks/useBooks';
import { BookStatus, BookStatusLabel } from '../src/types/book';
import * as BookRepository from '../src/database/bookRepository';
import { useColorScheme } from 'nativewind';
import Toast from 'react-native-toast-message';

const FormScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { colorScheme } = useColorScheme(); 
  const isDark = colorScheme === 'dark';

  const isEditing = !!id;
  const { addBook, editBookDetails } = useBooks();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<BookStatus>('want_to_read');
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar Livro' : 'Novo Livro',
    });
  }, [isEditing, navigation]);

  useEffect(() => {
    if (!isEditing) return;

    async function loadBook() {
      try {
        const book = await BookRepository.getBookById(Number(id));

        if (!book) {
          Toast.show({
            type: 'error',
            text1: 'Livro não encontrado!',
            position: 'bottom',
            visibilityTime: 3000,
          });
          router.back();
          return;
        }

        setTitle(book.title);
        setAuthor(book.author);
        setStatus(book.status);
        setRating(book.rating || 0);
        setNotes(book.synopsis ?? ''); 
        setCoverUrl(book.coverUrl ?? '');
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Não foi possível carregar o livro.',
          position: 'bottom',
          visibilityTime: 3000,
        });
        router.back();
      } finally {
        setLoading(false);
      }
    }

    loadBook();
  }, [id, isEditing, router]);

  useEffect(() => {
    if (status !== 'read') {
      setRating(0);
    }
  }, [status]);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [2, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const sourceUri = result.assets[0].uri;
        
        const filename = sourceUri.split('/').pop() || `cover_${Date.now()}.jpg`;
        const sourceFile = new File(sourceUri);
        const permanentFile = new File(Paths.document, filename);

        sourceFile.copy(permanentFile);
        setCoverUrl(permanentFile.uri);
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Não foi possível processar a imagem selecionada.',
        position: 'bottom',
        visibilityTime: 3000,
      });
    }
  };

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();

    if (!trimmedTitle || !trimmedAuthor) {
      Toast.show({
        type: 'error',
        text1: 'Campos obrigatórios',
        text2: 'Por favor, informe o título e o autor do livro.',
        position: 'bottom',
        visibilityTime: 3000,
      })
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await editBookDetails({
          id: Number(id),
          title: trimmedTitle,
          author: trimmedAuthor,
          status: status,
          synopsis: notes.trim() || undefined,
          coverUrl: coverUrl || undefined,
          rating: status === 'read' && rating > 0 ? rating : undefined,
        });
      } else {
        await addBook({
          title: trimmedTitle,
          author: trimmedAuthor,
          status: status,
          synopsis: notes.trim() || undefined,
          coverUrl: coverUrl || undefined,
          rating: status === 'read' && rating > 0 ? rating : undefined,
        });
      }

      Toast.show({
        type: 'success',
        text1: isEditing ? 'Alterações Salvas' : 'Livro Adicionado',
        text2: `O livro "${trimmedTitle}" está na sua estante.`,
        position: 'bottom',
        visibilityTime: 3000,
      });
      router.back();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Não foi possível salvar o livro. Tente novamente.',
        position: 'bottom',
        visibilityTime: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text className="mt-3 text-slate-500 text-sm">Carregando livro...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-50 dark:bg-slate-950"
    >
      <ScrollView
        className="flex-1 px-4 pt-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-5">
          <Text className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest">
            Título *
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: O Hobbit"
            placeholderTextColor="#9ca3af"
            className="bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-base text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800"
            maxLength={100}
            returnKeyType="next"
            autoFocus={!isEditing}
          />
        </View>

        <View className="mb-5">
          <Text className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest">
            Autor *
          </Text>
          <TextInput
            value={author}
            onChangeText={setAuthor}
            placeholder="Ex: J.R.R. Tolkien"
            placeholderTextColor="#9ca3af"
            className="bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-base text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800"
            maxLength={100}
            returnKeyType="next"
          />
        </View>

        <View className="mb-6">
          <Text className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest">
            Status da Leitura *
          </Text>
          <View className="flex-row gap-2">
            {(['want_to_read', 'reading', 'read'] as BookStatus[]).map((st) => (
              <TouchableOpacity
                key={st}
                activeOpacity={0.7}
                onPress={() => setStatus(st)}
                className={`flex-1 py-3 rounded-xl border items-center justify-center ${
                  status === st 
                    ? 'bg-slate-500 border-slate-500 dark:bg-indigo-600 dark:border-indigo-600' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <Text className={`font-bold text-[10px] sm:text-xs uppercase tracking-wider ${
                  status === st ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {BookStatusLabel[st]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {status === 'read' && (
          <View className="mb-6 items-center p-4 bg-slate-200 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
            <Text className="text-xs font-bold text-slate-800 dark:text-indigo-300 mb-3 uppercase tracking-widest">
              Sua Avaliação
            </Text>
            <View className="flex-row gap-2">
              {[1, 2, 3, 4, 5].map((starIndex) => (
                <TouchableOpacity
                  key={starIndex}
                  activeOpacity={0.6}
                  onPress={() => setRating(starIndex)}
                  className="p-1"
                >
                  <Star 
                    size={36} 
                    color={starIndex <= rating ? '#f59e0b' : '#64748b'} 
                    fill={starIndex <= rating ? '#f59e0b' : 'transparent'} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View className="mb-6">
          <Text className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest">
            Capa do Livro (Opcional)
          </Text>
          
          {coverUrl ? (
            <View className="w-full flex-row items-center justify-between bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4">
              <View className="flex-row items-center flex-1">
                <CheckCircle2 size={24} color="#10b981" />
                <View className="ml-3 flex-1">
                  <Text className="text-sm font-bold text-emerald-800 dark:text-emerald-400">
                    Capa anexada
                  </Text>
                  <Text className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">
                    A imagem foi salva no sistema.
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setCoverUrl('')}
                className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 ml-2"
                accessibilityLabel="Remover capa"
              >
                <Trash2 size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handlePickImage}
              className="w-full py-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 items-center justify-center flex-row"
            >
              <ImageIcon size={24} color="#94a3b8" />
              <Text className="ml-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                Escolher imagem da galeria
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="mb-5">
          <Text className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest">
            Anotações (Opcional)
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Suas opiniões sobre o livro..."
            placeholderTextColor="#9ca3af"
            className="bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-base text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
            style={{ minHeight: 100 }}
          />
          <Text className="text-xs text-slate-400 mt-1 text-right">
            {notes.length}/500
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className="rounded-xl overflow-hidden mb-4"
          accessibilityRole="button"
          accessibilityLabel={isEditing ? 'Salvar alterações' : 'Adicionar livro'}
        >
          <LinearGradient
            colors={!isDark ? ['#64748b', '#566475', '#475569'] : ['#2453ff', '#7157c7', '#34088c']}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="py-4 items-center justify-center flex-row"
          >
            {saving ? (
              <ActivityIndicator color="#ffffff" className="mr-2" />
            ) : (
              <View className="mr-2">
                {isEditing ? (
                  <Save size={20} color="#ffffff" strokeWidth={2.5} />
                ) : (
                  <PlusCircle size={20} color="#ffffff" strokeWidth={2.5} />
                )}
              </View>
            )}

            <Text className="text-white font-bold text-base tracking-wide">
              {saving 
                ? 'Salvando...' 
                : (isEditing ? 'Salvar Alterações' : 'Adicionar Livro')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="items-center py-3 mb-12"
          accessibilityRole="button"
          accessibilityLabel="Cancelar e voltar"
        >
          <Text className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Cancelar
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default FormScreen;