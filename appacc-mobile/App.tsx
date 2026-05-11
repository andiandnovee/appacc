import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import useAuthStore from './src/store/authStore';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ScanPOScreen from './src/screens/ScanPOScreen';
import ReceiptFormScreen from './src/screens/ReceiptFormScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const { isAuthenticated, isLoading, clearAuth } = useAuthStore();

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) clearAuth();
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
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ScanPO" component={ScanPOScreen} />
            <Stack.Screen name="ReceiptForm" component={ReceiptFormScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
