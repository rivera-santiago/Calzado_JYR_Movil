import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import React, { createContext, useContext, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Toast = { id: number; message: string }

const ToastContext = createContext<{ show: (message: string) => void } | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const colorScheme = useColorScheme()
  const active = colorScheme === 'dark' ? Colors.dark : Colors.light

  const show = (message: string) => {
    const id = Date.now()
    setToasts((t) => [...t, { id, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000)
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <View pointerEvents="box-none" style={styles.container}>
        {toasts.map((t) => (
          <View key={t.id} style={[styles.toast, { backgroundColor: active.card, borderColor: active.border }]}> 
            <Text style={[styles.text, { color: active.text }]}>{t.message}</Text>
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 40, left: 16, right: 16, alignItems: 'center', zIndex: 9999 },
  toast: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, marginTop: 8, minWidth: 160 },
  text: { fontWeight: '700' },
})
