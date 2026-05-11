import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../store/authStore';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user, clearAuth } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo, {user?.name ?? 'User'} 👋</Text>
          <Text style={styles.subGreeting}>APPACC Invoice Receipt</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={clearAuth}>
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Cards */}
      <View style={styles.menuGrid}>

        {/* Scan PO */}
        <TouchableOpacity
          style={[styles.card, styles.cardPrimary]}
          onPress={() => navigation.navigate('ScanPO')}
        >
          <Text style={styles.cardIcon}>📷</Text>
          <Text style={styles.cardTitle}>Scan PO</Text>
          <Text style={styles.cardDesc}>Scan nomor PO dari dokumen untuk input receipt baru</Text>
        </TouchableOpacity>

        {/* Riwayat */}
        <TouchableOpacity
          style={[styles.card, styles.cardSecondary]}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.cardIcon}>📋</Text>
          <Text style={styles.cardTitle}>Riwayat</Text>
          <Text style={styles.cardDesc}>Lihat daftar invoice receipt yang sudah diinput</Text>
        </TouchableOpacity>

      </View>

      {/* Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Fitur lainnya tersedia di versi web APPACC
        </Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e1b4b',
  },
  subGreeting: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  logoutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 13,
    color: '#dc2626',
    fontWeight: '600',
  },
  menuGrid: {
    padding: 24,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  cardPrimary: {
    backgroundColor: '#6366f1',
  },
  cardSecondary: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    color: '#ffffff',
  },
  cardDesc: {
    fontSize: 13,
    color: '#c7d2fe',
    lineHeight: 20,
  },
  infoBox: {
    marginHorizontal: 24,
    padding: 16,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoText: {
    fontSize: 13,
    color: '#1d4ed8',
    textAlign: 'center',
  },
});
