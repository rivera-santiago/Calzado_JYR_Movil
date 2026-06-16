import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = { visible: boolean; onClose: () => void; onApply: (filters: any) => void }

export function FilterModal({ visible, onClose, onApply }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Filtros</Text>
          <Text style={{ color: '#6b7280', marginBottom: 12 }}>Aquí podrá aplicar filtros (categorías, talla, precio)</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
            <TouchableOpacity onPress={onClose} style={styles.btn}><Text>Cerrar</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => { onApply({}); onClose() }} style={[styles.btn, { backgroundColor: '#10b981' }]}><Text style={{ color: '#fff' }}>Aplicar</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  title: { fontWeight: '900', fontSize: 18, marginBottom: 8 },
  btn: { padding: 10, borderRadius: 8 }
})
