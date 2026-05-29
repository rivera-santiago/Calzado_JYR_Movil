import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as z from 'zod';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { forgotPasswordAPI } from '@/services/api';

const forgotSchema = z.object({ email: z.string().min(1, 'Correo requerido').email('Correo no válido') });
type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const activeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const [apiLoading, setApiLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotFormValues>({ resolver: zodResolver(forgotSchema), defaultValues: { email: '' } });

  const onSubmit = async (data: ForgotFormValues) => {
    setApiLoading(true);
    try {
      const res = await forgotPasswordAPI(data.email);
      setMessage(res.message || 'Si el correo existe, recibirás instrucciones.');
    } catch (err: any) {
      setMessage(err.message || 'Error procesando solicitud');
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: activeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={[styles.backButton, { backgroundColor: activeColors.card }]} onPress={() => router.back()}>
          <ArrowLeft size={20} color={activeColors.text} />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: activeColors.text }]}>Recuperar Contraseña</Text>
          <Text style={styles.subtitle}>Ingresa tu correo y te enviaremos instrucciones.</Text>
        </View>

        <View style={[styles.card, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
          {message && <Text style={[styles.fieldError, { color: activeColors.secondary }]}>{message}</Text>}

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: activeColors.text }]}>Correo</Text>
            <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => (
              <TextInput style={[styles.input, { color: activeColors.text }]} placeholder="correo@ejemplo.com" placeholderTextColor={activeColors.icon} keyboardType="email-address" autoCapitalize="none" onBlur={onBlur} onChangeText={onChange} value={value} />
            )} />
            {errors.email && <Text style={[styles.fieldError, { color: activeColors.error }]}>{errors.email.message}</Text>}
          </View>

          <TouchableOpacity style={[styles.loginButton, { backgroundColor: activeColors.primary }]} onPress={handleSubmit(onSubmit)} disabled={apiLoading}>
            {apiLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Enviar instrucciones</Text>}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 48, paddingBottom: 40, justifyContent: 'center', alignItems: 'center' },
  backButton: { position: 'absolute', top: 40, left: 24, padding: 10, borderRadius: 12 },
  headerContainer: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: 0.5 },
  subtitle: { fontSize: 14, color: '#64748b', fontWeight: '600', marginTop: 4 },
  card: { borderRadius: 20, padding: 28, borderWidth: 1, marginBottom: 24, width: 520, maxWidth: '92%', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 8 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '700', marginBottom: 8 },
  input: { fontSize: 15, fontWeight: '500', borderWidth: 0 },
  fieldError: { fontSize: 12, marginTop: 6 },
  loginButton: { height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  loginButtonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
