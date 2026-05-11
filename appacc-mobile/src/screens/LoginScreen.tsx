import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import useAuthStore from '../store/authStore';
import { googleAuthCallback } from '../api/auth';

// Google Signin hanya load di APK (bukan Expo Go)
let GoogleSignin: any = null;
let statusCodes: any = {};

try {
  const gsModule = require('@react-native-google-signin/google-signin');
  GoogleSignin = gsModule.GoogleSignin;
  statusCodes = gsModule.statusCodes;

  GoogleSignin.configure({
    webClientId: '478317070172-k2hmh3a5gmgjgmiu46f1v1ori3ic6adc.apps.googleusercontent.com',
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });
} catch (e) {
  // Expo Go — native module tidak tersedia
}

const IS_EXPO_GO = !GoogleSignin;

export default function LoginScreen() {
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // ── DEV MODE: bypass login langsung masuk ──────────────────────────────
  const handleDevLogin = async () => {
    setLoading(true);
    try {
      await setAuth(
        {
          id: 1,
          name: 'Andi Dev',
          email: 'andi@dev.local',
          roles: ['accounting'],
        },
        'dummy-token-dev'
      );
    } finally {
      setLoading(false);
    }
  };

  // ── PRODUCTION MODE: Google Sign-In native ─────────────────────────────
  const handleGoogleLogin = async () => {
    if (!GoogleSignin) return;
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) throw new Error('Gagal mendapatkan ID token dari Google');

      const { user, token } = await googleAuthCallback(idToken);
      await setAuth(user, token);

    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancel
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Info', 'Login sedang diproses');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services tidak tersedia');
      } else {
        Alert.alert('Login Gagal', error.message ?? 'Terjadi kesalahan');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>APPACC</Text>
        <Text style={styles.subtitle}>Invoice Receipt Mobile</Text>
      </View>

      <TouchableOpacity
        style={[styles.googleBtn, loading && styles.googleBtnDisabled]}
        onPress={IS_EXPO_GO ? handleDevLogin : handleGoogleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.googleBtnText}>
            {IS_EXPO_GO ? 'Masuk (Dev Mode)' : 'Masuk dengan Google'}
          </Text>
        )}
      </TouchableOpacity>

      {IS_EXPO_GO && (
        <Text style={styles.devNote}>
          ⚠️ Expo Go — Google Sign-In aktif setelah build APK
        </Text>
      )}
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
  googleBtnDisabled: {
    opacity: 0.6,
  },
  googleBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  devNote: {
    marginTop: 16,
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
