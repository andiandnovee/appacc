import React, { useState } from 'react';
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
import useAuthStore from '../store/authStore';
import { googleAuthCallback } from '../api/auth';

GoogleSignin.configure({
  webClientId: '478317070172-k2hmh3a5gmgjgmiu46f1v1ori3ic6adc.apps.googleusercontent.com',
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

export default function LoginScreen() {
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) throw new Error('Gagal mendapatkan ID token dari Google');

      // Kirim idToken ke backend APPACC
      const { user, token } = await googleAuthCallback(idToken);
      await setAuth(user, token);

    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancel, diam saja
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
        onPress={handleGoogleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.googleBtnText}>Masuk dengan Google</Text>
        )}
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
});
