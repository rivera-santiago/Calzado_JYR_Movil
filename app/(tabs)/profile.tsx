import { useRouter } from 'expo-router';
import { Briefcase, LogIn, LogOut, Mail, Shield, User as UserIcon } from 'lucide-react-native';
import React from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const activeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start()
  }, [fadeAnim])

  const handleLogout = async () => {
    await clearAuth();
    router.replace('/(tabs)');
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: activeColors.background }]}>
      <Animated.View style={{ opacity: fadeAnim }}>
      <View style={[styles.headerBanner, { backgroundColor: activeColors.primary }]}>
        <View style={styles.bannerOverlay} />
      </View>

      <View style={styles.contentContainer}>
        {/* Profile Avatar Card */}
        <View style={[styles.profileCard, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
          <View style={[styles.avatarContainer, { borderColor: activeColors.card }]}>
            {isAuthenticated && user ? (
              <View style={[styles.avatarPlaceholder, { backgroundColor: activeColors.secondary }]}>
                <Text style={styles.avatarText}>{user.first_name[0]}{user.last_name[0]}</Text>
              </View>
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: '#cbd5e1' }]}>
                <UserIcon size={40} color="#64748b" />
              </View>
            )}
          </View>

          {isAuthenticated && user ? (
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: activeColors.text }]}>
                {user.first_name} {user.last_name}
              </Text>
              <View style={[styles.roleBadge, { backgroundColor: activeColors.secondary + '15' }]}>
                <Text style={[styles.roleBadgeText, { color: activeColors.secondary }]}>
                  {user.role.description}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: activeColors.text }]}>Invitado</Text>
              <Text style={styles.userSubtitle}>Inicia sesión para ver tu panel completo</Text>
            </View>
          )}
        </View>

        {/* Dynamic content depending on auth state */}
        {isAuthenticated && user ? (
          <View style={styles.infoSection}>
            <Text style={[styles.sectionTitle, { color: activeColors.text }]}>Datos del Usuario</Text>
            
            <View style={[styles.infoCard, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
              {/* Email Row */}
              <View style={styles.infoRow}>
                <Mail size={20} color={activeColors.icon} style={styles.rowIcon} />
                <View style={styles.rowContent}>
                  <Text style={styles.rowLabel}>Correo Electrónico</Text>
                  <Text style={[styles.rowValue, { color: activeColors.text }]}>{user.email}</Text>
                </View>
              </View>
              <View style={[styles.divider, { backgroundColor: activeColors.border }]} />

              {/* Occupation Row */}
              <View style={styles.infoRow}>
                <Briefcase size={20} color={activeColors.icon} style={styles.rowIcon} />
                <View style={styles.rowContent}>
                  <Text style={styles.rowLabel}>Ocupación / Puesto</Text>
                  <Text style={[styles.rowValue, { color: activeColors.text }]}>{user.occupation || 'N/A'}</Text>
                </View>
              </View>
              <View style={[styles.divider, { backgroundColor: activeColors.border }]} />

              {/* Role Row */}
              <View style={styles.infoRow}>
                <Shield size={20} color={activeColors.icon} style={styles.rowIcon} />
                <View style={styles.rowContent}>
                  <Text style={styles.rowLabel}>Rol de Sistema</Text>
                  <Text style={[styles.rowValue, { color: activeColors.text }]}>{user.role.name.toUpperCase()}</Text>
                </View>
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={[styles.logoutButton, { borderColor: activeColors.error }]} onPress={handleLogout}>
              <LogOut size={20} color={activeColors.error} style={{ marginRight: 8 }} />
              <Text style={[styles.logoutButtonText, { color: activeColors.error }]}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.loginSection}>
            <Text style={[styles.loginPromptTitle, { color: activeColors.text }]}>¿Ya eres parte de Calzado J&R?</Text>
            <Text style={styles.loginPromptDesc}>
              Ingresa tus credenciales autorizadas como Administrador o Empleado para gestionar el inventario, ver pedidos en tiempo real y reportes avanzados.
            </Text>

            <TouchableOpacity style={[styles.loginBtn, { backgroundColor: activeColors.primary }]} onPress={handleLogin}>
              <LogIn size={20} color="#ffffff" style={{ marginRight: 10 }} />
              <Text style={styles.loginBtnText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBanner: {
    height: 140,
    width: '100%',
    position: 'relative',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileCard: {
    borderRadius: 24,
    padding: 20,
    marginTop: -60,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    overflow: 'hidden',
    marginTop: -50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 1,
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
  },
  userSubtitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 4,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  infoSection: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
    paddingLeft: 4,
  },
  infoCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  rowIcon: {
    marginRight: 16,
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '800',
  },
  loginSection: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 10,
  },
  loginPromptTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  loginPromptDesc: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: 24,
  },
  loginBtn: {
    flexDirection: 'row',
    height: 52,
    paddingHorizontal: 28,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
