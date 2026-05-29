import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as z from 'zod';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { registerAPI } from '@/services/api';

const registerSchema = z.object({
  first_name: z.string().min(1, 'Nombre requerido'),
  last_name: z.string().min(1, 'Apellido requerido'),
  email: z.string().min(1, 'Correo requerido').email('Correo no válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const activeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const [apiLoading, setApiLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { first_name: '', last_name: '', email: '', password: '' },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setErrorMessage(null);
    setApiLoading(true);
    try {
      await registerAPI(data);
      // After successful register, navigate to login
      router.replace('/(auth)/login');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al registrar');
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
          <View style={[styles.logoContainer, { borderColor: activeColors.secondary }]}>
              <Image source={require('@/assets/images/icon.png')} style={styles.logoImage} />
          </View>
          <Text style={[styles.title, { color: activeColors.text }]}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Completa tus datos para registrarte</Text>
          <View style={[styles.cardDivider, { backgroundColor: activeColors.border }]} />
        </View>

        <View style={[styles.card, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
          {errorMessage && <Text style={[styles.fieldError, { color: activeColors.error }]}>{errorMessage}</Text>}

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: activeColors.text }]}>Nombre</Text>
            <Controller control={control} name="first_name" render={({ field: { onChange, onBlur, value } }) => (
              <TextInput style={[styles.input, { color: activeColors.text }]} placeholder="Nombre" placeholderTextColor={activeColors.icon} onBlur={onBlur} onChangeText={onChange} value={value} />
            )} />
            {errors.first_name && <Text style={[styles.fieldError, { color: activeColors.error }]}>{errors.first_name.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: activeColors.text }]}>Apellido</Text>
            <Controller control={control} name="last_name" render={({ field: { onChange, onBlur, value } }) => (
              <TextInput style={[styles.input, { color: activeColors.text }]} placeholder="Apellido" placeholderTextColor={activeColors.icon} onBlur={onBlur} onChangeText={onChange} value={value} />
            )} />
            {errors.last_name && <Text style={[styles.fieldError, { color: activeColors.error }]}>{errors.last_name.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: activeColors.text }]}>Correo</Text>
            <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => (
              <TextInput style={[styles.input, { color: activeColors.text }]} placeholder="correo@ejemplo.com" placeholderTextColor={activeColors.icon} keyboardType="email-address" autoCapitalize="none" onBlur={onBlur} onChangeText={onChange} value={value} />
            )} />
            {errors.email && <Text style={[styles.fieldError, { color: activeColors.error }]}>{errors.email.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: activeColors.text }]}>Contraseña</Text>
            <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => (
              <TextInput style={[styles.input, { color: activeColors.text }]} placeholder="••••••" placeholderTextColor={activeColors.icon} secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} />
            )} />
            {errors.password && <Text style={[styles.fieldError, { color: activeColors.error }]}>{errors.password.message}</Text>}
          </View>

          <TouchableOpacity style={[styles.loginButton, { backgroundColor: activeColors.primary }]} onPress={handleSubmit(onSubmit)} disabled={!acceptedTerms || apiLoading}>
            {apiLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Crear Cuenta</Text>}
          </TouchableOpacity>
          {/* Terms checkbox */}
          <View style={styles.termsRow}>
            <TouchableOpacity style={styles.rememberBoxRow} onPress={() => setAcceptedTerms(!acceptedTerms)}>
              <View style={[styles.rememberBox, { borderColor: activeColors.border }]}> {acceptedTerms && <View style={[styles.rememberBoxChecked, { backgroundColor: activeColors.primary }]} />}</View>
              <Text style={[styles.termsText, { color: activeColors.text }]}>He leído y acepto los </Text>
              <Text style={[styles.termsLink, { color: activeColors.primary }]}>Términos y Condiciones</Text>
            </TouchableOpacity>
          </View>

          {/* Sign-in link */}
          <View style={styles.signupRow}>
            <Text style={[styles.signupText, { color: activeColors.icon }]}>¿Ya tienes cuenta?</Text>
            <Text style={[styles.signupLink, { color: activeColors.primary }]} onPress={() => router.push('/(auth)/login')}> Iniciar Sesión</Text>
          </View>
        </View>

        <Text style={styles.footerNote}>Al crear una cuenta aceptas los términos y condiciones.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // reuse same style names as login for consistency
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 48, paddingBottom: 40, justifyContent: 'center', alignItems: 'center' },
  backButton: { position: 'absolute', top: 40, left: 24, padding: 10, borderRadius: 12 },
  headerContainer: { alignItems: 'center', marginBottom: 24 },
  logoContainer: { width: 72, height: 72, borderRadius: 24, backgroundColor: '#1e40af', borderWidth: 3, justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: '#1e40af', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 4 },
  logoText: { color: '#fff', fontSize: 26, fontWeight: '900' },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: 0.5 },
  subtitle: { fontSize: 14, color: '#64748b', fontWeight: '600', marginTop: 4 },
  cardDivider: { height: 1, marginVertical: 12, width: '100%', opacity: 0.6 },
  card: { borderRadius: 20, padding: 28, borderWidth: 1, marginBottom: 24, width: 520, maxWidth: '92%', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 8 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '700', marginBottom: 8 },
  input: { fontSize: 15, fontWeight: '500', borderWidth: 0 },
  fieldError: { fontSize: 12, marginTop: 6 },
  loginButton: { height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  loginButtonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  footerNote: { textAlign: 'center', fontSize: 11, color: '#94a3b8' },
  logoImage: { width: 56, height: 56, resizeMode: 'contain' },
  rememberBoxRow: { flexDirection: 'row', alignItems: 'center' },
  rememberBox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, marginRight: 8, justifyContent: 'center', alignItems: 'center' },
  rememberBoxChecked: { width: 12, height: 12, borderRadius: 2 },
  termsRow: { marginTop: 12 },
  termsText: { fontSize: 13, fontWeight: '500' },
  termsLink: { fontSize: 13, fontWeight: '700', textDecorationLine: 'underline', marginLeft: 6 },
  signupRow: { marginTop: 14, alignItems: 'center', justifyContent: 'center' },
  signupText: { fontSize: 13, fontWeight: '500', opacity: 0.9 },
  signupLink: { fontSize: 13, fontWeight: '700', textDecorationLine: 'underline', marginLeft: 6 },
});
