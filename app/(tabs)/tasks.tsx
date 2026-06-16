
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { HamburgerButton } from '@/components/ui/hamburger-button'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/components/ui/toast'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { taskService, Task } from '@/services/taskService'
import { useAuthStore } from '@/store/authStore'
import { useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { Animated, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function TasksScreen() {
  const colorScheme = useColorScheme()
  const active = colorScheme === 'dark' ? Colors.dark : Colors.light
  const user = useAuthStore((s) => s.user)
  const toast = useToast()

  const fadeAnim = React.useRef(new Animated.Value(0)).current
  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start()
  }, [fadeAnim])

  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [newTitle, setNewTitle] = useState('')

  useFocusEffect(
    useCallback(() => {
      if (!user) return
      setLoading(true)
      taskService.getAll(String(user.id)).then(setTasks).finally(() => setLoading(false))
    }, [user])
  )

  const handleToggle = useCallback(async (task: Task) => {
    await taskService.update(task.id, { completed: !task.completed })
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, completed: !t.completed } : t))
    toast.show(task.completed ? 'Pendiente' : 'Completada')
  }, [toast])

  const handleDelete = useCallback(async (id: string) => {
    await taskService.delete(id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
    toast.show('Tarea eliminada')
  }, [toast])

  const handleAdd = useCallback(async () => {
    if (!user || !newTitle.trim()) return
    const task = await taskService.create(String(user.id), newTitle.trim())
    setTasks((prev) => [task, ...prev])
    setNewTitle('')
    toast.show('Tarea creada')
  }, [user, newTitle, toast])

  if (!user) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: active.background }]}>
        <View style={[styles.appBar, { backgroundColor: active.card, borderBottomColor: active.border }]}>
          <HamburgerButton />
          <Text style={[styles.appBarTitle, { color: active.text }]}>Mis Tareas</Text>
        </View>
        <View style={styles.centered}>
          <ThemedText>Inicia sesión para gestionar tus tareas</ThemedText>
        </View>
      </ThemedView>
    )
  }

  const renderItem = ({ item }: { item: Task }) => (
    <View style={[styles.row, { backgroundColor: active.card, borderColor: active.border }]}>
      <TouchableOpacity onPress={() => handleToggle(item)} style={styles.checkbox} accessibilityRole="button">
        <View style={[styles.checkboxInner, item.completed && { backgroundColor: active.secondary }]}>
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
      <View style={styles.taskInfo}>
        <Text style={[styles.taskTitle, { color: active.text }, item.completed && styles.completedText]}>{item.title}</Text>
        {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn} accessibilityRole="button">
        <Text style={{ color: '#ef4444', fontWeight: '800' }}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <ThemedView style={[styles.container, { backgroundColor: active.background }]}>
      <View style={[styles.appBar, { backgroundColor: active.card, borderBottomColor: active.border }]}>
        <HamburgerButton />
        <Text style={[styles.appBarTitle, { color: active.text }]}>Mis Tareas</Text>
      </View>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <FlatList
        data={tasks}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 80 }}
        ListEmptyComponent={
          loading
            ? <View style={styles.empty}><ThemedText>Cargando...</ThemedText></View>
            : <EmptyState title="Sin tareas" subtitle="Agrega una nueva tarea con el campo de abajo" />
        }
      />

      <View style={[styles.inputBar, { backgroundColor: active.card, borderColor: active.border }]}>
        <TextInput
          style={[styles.input, { color: active.text }]}
          placeholder="Nueva tarea..."
          placeholderTextColor="#9ca3af"
          value={newTitle}
          onChangeText={setNewTitle}
          onSubmitEditing={handleAdd}
        />
        <TouchableOpacity onPress={handleAdd} style={[styles.addBtn, { backgroundColor: active.secondary }]} disabled={!newTitle.trim()} accessibilityRole="button">
          <Text style={{ color: '#fff', fontWeight: '800' }}>Agregar</Text>
        </TouchableOpacity>
      </View>
      </Animated.View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 54 : 32,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginLeft: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  checkbox: { marginRight: 12 },
  checkboxInner: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#9ca3af', justifyContent: 'center', alignItems: 'center' },
  checkmark: { color: '#fff', fontWeight: '900', fontSize: 14 },
  taskInfo: { flex: 1 },
  taskTitle: { fontWeight: '700', fontSize: 15 },
  completedText: { textDecorationLine: 'line-through', opacity: 0.5 },
  desc: { fontSize: 12, color: '#64748b', marginTop: 2 },
  deleteBtn: { marginLeft: 8, padding: 4 },
  empty: { padding: 40, alignItems: 'center' },
  inputBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 12, borderTopWidth: 1, gap: 8 },
  input: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#d1d5db' },
  addBtn: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, justifyContent: 'center' },
})
