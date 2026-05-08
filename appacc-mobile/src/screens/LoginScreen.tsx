import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import * as SecureStore from 'expo-secure-store';
import useAuthStore from '../store/authStore';
import { googleAuthCallback } from '../api/auth';

GoogleSignin.configure({
  webClientId: 'GANTI_DENGAN_WEB_CLIENT_ID_GOOGLE_KAMU',
  offlineAccess: true,
});

export default function LoginScreen() {
  const { setAuth, isLoading } = useAuthStore();

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) throw new Error('Gagal mendapatkan ID token');

      // Kirim ke backend APPACC
      const { user, token } = await googleAuthCallback(idToken);
      await setAuth(user, token);

    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancel, diam saja
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Info', 'Login sedang diproses');
      } else {
        Alert.alert('Login Gagal', error.message ?? 'Terjadi kesalahan');
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>APPACC</Text>
        <Text style={styles.subtitle}>Invoice Receipt Mobile</Text>
      </View>

      <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleLogin}>
        <Text style={styles.googleBtnText}>Masuk dengan Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 64,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1e1b4b',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  googleBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  googleBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
