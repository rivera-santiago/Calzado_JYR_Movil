import { Tabs } from 'expo-router';

import { DrawerProvider } from '@/components/ui/hamburger-menu';

export default function TabLayout() {
  return (
    <DrawerProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
        <Tabs.Screen name="catalog" options={{ title: 'Catálogo' }} />
        <Tabs.Screen name="favorites" options={{ title: 'Favoritos' }} />
        <Tabs.Screen name="profile" options={{ title: 'Mi Cuenta' }} />
      </Tabs>
    </DrawerProvider>
  );
}
