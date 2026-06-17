import 'react-native-url-polyfill/auto';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ToastProvider } from '@/components/ui/toast';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { initDatabase } from '@/lib/database';
import { createSupabaseClient } from '@/services/supabaseClient';
import { syncManager } from '@/services/syncManager';
import { useAuthStore } from '@/store/authStore';
import { useFavoritesStore } from '@/store/favoritesStore';

// Create a client for TanStack Query
const queryClient = new QueryClient();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isLoading, initializeAuth, token } = useAuthStore();
  useEffect(() => {
    initializeAuth();
    Promise.all([
      initDatabase().catch((e) => console.warn('DB init failed', e)),
      useFavoritesStore.getState().load(),
    ])
  }, [initializeAuth]);

  // Configure sync manager when token becomes available (token may be set after initializeAuth resolves)
  useEffect(() => {
    if (!token) return
    const supabase = createSupabaseClient(token)
    syncManager.configure({
      insert: async (table, payload) => await supabase.from(table).insert(payload).throwOnError(),
      update: async (table, payload) => await supabase.from(table).update(payload).eq('id', payload.id).throwOnError(),
      delete: async (table, payload) => await supabase.from(table).delete().eq('id', payload.id).throwOnError(),
    })
  }, [token])

  if (isLoading) {
    const activeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: activeColors.background }}>
        <ActivityIndicator size="large" color={activeColors.primary} />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ToastProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
