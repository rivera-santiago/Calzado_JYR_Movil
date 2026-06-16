import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldAlert } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as z from 'zod';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { loginAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';

const loginSchema = z.object({
  email: z.string().min(1, 'El correo electrónico es requerido').email('Correo electrónico no válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const setAuth = useAuthStore((state) => state.setAuth);
  const activeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMessage(null);
    setApiLoading(true);
    try {
      const response = await loginAPI(data.email, data.password);
      await setAuth(response.user, response.access_token);
      router.replace('/(tabs)');
    } catch (error: unknown) {
      const msg = (error && typeof error === 'object' && 'message' in error) ? String((error as { message?: unknown }).message) : String(error)
      setErrorMessage(msg || 'Error al iniciar sesión');
    } finally {
      setApiLoading(false);
    }
  };

  const handleQuickLogin = () => {
    setValue('email', 'ronald.jefe@gmail.com');
    setValue('password', 'Test123456!');
    setErrorMessage(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: activeColors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Back Button */}
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: activeColors.card }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={activeColors.text} />
        </TouchableOpacity>

        {/* Header Branding */}
        <View style={styles.headerContainer}>
          <View style={[styles.logoContainer, { borderColor: activeColors.secondary }]}>
            <Image source={require('@/assets/images/icon.png')} style={styles.logoImage} />
          </View>
          <Text style={[styles.title, { color: activeColors.text }]}>CALZADO J&R</Text>
          <Text style={styles.subtitle}>Calidad y Estilo a tu Alcance</Text>
        </View>

        {/* Login Form Card */}
        <View style={[styles.card, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
          <Text style={[styles.cardTitle, { color: activeColors.text }]}>Iniciar Sesión</Text>
          <Text style={styles.cardSubtitle}>Ingresa tus credenciales para acceder a tu cuenta</Text>
          <View style={[styles.cardDivider, { backgroundColor: activeColors.border }]} />

          {errorMessage && (
            <View style={[styles.errorBox, { backgroundColor: activeColors.error + '15', borderColor: activeColors.error }]}>
              <ShieldAlert size={20} color={activeColors.error} style={{ marginRight: 8 }} />
              <Text style={[styles.errorBoxText, { color: activeColors.error }]}>{errorMessage}</Text>
            </View>
          )}

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: activeColors.text }]}>Correo Electrónico</Text>
            <View style={[styles.inputContainer, { borderColor: errors.email ? activeColors.error : activeColors.border }]}>
              <Mail size={20} color={activeColors.icon} style={styles.inputIcon} />
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, { color: activeColors.text }]}
                    placeholder="correo@ejemplo.com"
                    placeholderTextColor={activeColors.icon}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
            </View>
            {errors.email && <Text style={[styles.fieldError, { color: activeColors.error }]}>{errors.email.message}</Text>}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: activeColors.text }]}>Contraseña</Text>
            <View style={[styles.inputContainer, { borderColor: errors.password ? activeColors.error : activeColors.border }]}>
              <Lock size={20} color={activeColors.icon} style={styles.inputIcon} />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, { color: activeColors.text }]}
                    placeholder="••••••••"
                    placeholderTextColor={activeColors.icon}
                    secureTextEntry={secureTextEntry}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                {secureTextEntry ? (
                  <EyeOff size={20} color={activeColors.icon} style={styles.passwordToggle} />
                ) : (
                  <Eye size={20} color={activeColors.icon} style={styles.passwordToggle} />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={[styles.fieldError, { color: activeColors.error }]}>{errors.password.message}</Text>}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: activeColors.primary }]}
            onPress={handleSubmit(onSubmit)}
            disabled={apiLoading}
          >
            {apiLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.loginButtonText}>Ingresar</Text>
            )}
          </TouchableOpacity>

          {/* Remember + Forgot row */}
          <View style={styles.rememberRow}>
            <TouchableOpacity style={styles.rememberBoxRow} onPress={() => setRememberMe(!rememberMe)}>
              <View style={[styles.rememberBox, { borderColor: activeColors.border }]}>
                {rememberMe && <View style={[styles.rememberBoxChecked, { backgroundColor: activeColors.primary }]} />}
              </View>
              <Text style={[styles.rememberText, { color: activeColors.text }]}>Recuérdame</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
              <Text style={[styles.forgotLink, { color: activeColors.primary }]}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          {/* Signup link centered */}
          <View style={styles.signupRow}>
            <Text style={[styles.signupText, { color: activeColors.icon }]}>¿No tienes cuenta? </Text>
            <Text style={[styles.signupLink, { color: activeColors.primary }]} onPress={() => router.push('/(auth)/register')}>Crear Cuenta</Text>
          </View>
        </View>

        {/* Quick Demo Autofill Badge */}
        <Pressable
          style={[styles.quickLoginCard, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}
          onPress={handleQuickLogin}
        >
          <Text style={[styles.quickLoginTitle, { color: activeColors.secondary }]}>✨ Modo Demostración</Text>
          <Text style={[styles.quickLoginText, { color: activeColors.text }]}>
            Presiona aquí para auto-completar los datos de administrador de prueba.
          </Text>
          <Text style={styles.quickLoginCredentials}>
            Email: ronald.jefe@gmail.com | Clave: Test123456!
          </Text>
        </Pressable>

        <Text style={styles.footerNote}>CALZADO J&R © 2026. Todos los derechos reservados.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 24,
  },
  logoImage: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
    padding: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#1e40af',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 4,
  },
  card: {
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    width: 520,
    maxWidth: '92%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 6,
  },
  cardDivider: {
    height: 1,
    marginVertical: 12,
    width: '100%',
    opacity: 0.6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 24,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  errorBoxText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  passwordToggle: {
    padding: 4,
  },
  fieldError: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  loginButton: {
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  quickLoginCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 32,
    alignItems: 'center',
  },
  quickLoginTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  quickLoginText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
    opacity: 0.8,
  },
  quickLoginCredentials: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
    marginTop: 8,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 8,
  },
  authFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '700',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  rememberBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rememberBoxChecked: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  rememberText: {
    fontSize: 13,
    fontWeight: '600',
  },
  forgotLink: {
    fontSize: 13,
    fontWeight: '700',
  },
  signupRow: {
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupText: {
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.9,
  },
  signupLink: {
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
    marginLeft: 6,
  },
});
