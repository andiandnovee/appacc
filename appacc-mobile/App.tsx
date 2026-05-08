import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import useAuthStore from './src/store/authStore';
import LoginScreen from './src/screens/LoginScreen';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const { isAuthenticated, isLoading, setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    // Cek token tersimpan saat app buka
    const bootstrapAuth = async () => {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) {
        clearAuth();
      }
      // nanti tambah getProfile() untuk verify token masih valid
    };
    bootstrapAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          // Nanti tambah screen utama di sini
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
