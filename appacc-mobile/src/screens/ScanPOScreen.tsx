import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { searchPo } from '../api/po';
import { PoResult } from '../types';

export default function ScanPOScreen() {
  const navigation = useNavigation<any>();
  const [poNumber, setPoNumber]   = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult]       = useState<PoResult | null>(null);
  const [searched, setSearched]   = useState(false);

  const handleSearch = async () => {
    if (!poNumber.trim()) {
      Alert.alert('Perhatian', 'Masukkan nomor PO terlebih dahulu');
      return;
    }
    setIsSearching(true);
    setSearched(true);
    setResult(null);

    try {
      const data = await searchPo(poNumber.trim());
      setResult(data);
    } catch (error: any) {
      Alert.alert('Gagal', error?.response?.data?.message ?? 'Tidak dapat terhubung ke server');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Input PO</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Tombol Scan OCR */}
        <TouchableOpacity
          style={styles.cameraBox}
          onPress={() => navigation.navigate('CameraOCR')}
        >
          <Text style={styles.cameraIcon}>📷</Text>
          <Text style={styles.cameraText}>Scan Dokumen / Invoice</Text>
          <Text style={styles.cameraSubText}>Tap untuk buka kamera OCR</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>atau ketik manual</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nomor PO</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: 4500012345"
            placeholderTextColor="#9ca3af"
            value={poNumber}
            onChangeText={setPoNumber}
            keyboardType="numeric"
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
        </View>

        <TouchableOpacity
          style={[styles.searchBtn, isSearching && styles.searchBtnDisabled]}
          onPress={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.searchBtnText}>Cari PO</Text>
          )}
        </TouchableOpacity>

        {searched && !isSearching && (
          <View style={styles.resultsSection}>
            {result ? (
              <TouchableOpacity
                style={styles.poCard}
                onPress={() => navigation.navigate('ReceiptForm', { po: result })}
              >
                <View style={styles.poCardHeader}>
                  <Text style={styles.poNumber}>{result.po_number}</Text>
                  {result.is_pkp && (
                    <View style={styles.pkpBadge}>
                      <Text style={styles.pkpBadgeText}>PKP</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.poVendor}>{result.vendor_name}</Text>
                <View style={styles.poFooter}>
                  <Text style={styles.poAmount}>
                    Rp {Number(result.amount).toLocaleString('id-ID')}
                  </Text>
                  <Text style={styles.poGroup}>{result.purc_grp}</Text>
                </View>
                {result.is_pkp && (
                  <Text style={styles.ppnHint}>
                    Sudah include PPN 11% (DPP: Rp {Number(result.dpp).toLocaleString('id-ID')})
                  </Text>
                )}
                <Text style={styles.poSelectHint}>Tap untuk input receipt →</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyText}>
                  Nomor PO tidak ditemukan.{'\n'}
                  Pastikan nomor PO sudah benar.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
  },
  backBtn:     { width: 80 },
  backText:    { fontSize: 14, color: '#6366f1', fontWeight: '600' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1e1b4b' },
  content:     { padding: 24 },
  cameraBox: {
    backgroundColor: '#1e1b4b', borderRadius: 16, height: 160,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  cameraIcon:    { fontSize: 40, marginBottom: 8 },
  cameraText:    { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  cameraSubText: { color: '#a5b4fc', fontSize: 12, marginTop: 4 },
  divider: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 8,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  dividerText: { fontSize: 12, color: '#9ca3af', paddingHorizontal: 8 },
  inputGroup:  { marginBottom: 16 },
  label:       { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: {
    backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0',
    borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: '#111827',
  },
  searchBtn: {
    backgroundColor: '#6366f1', paddingVertical: 16,
    borderRadius: 12, alignItems: 'center', marginBottom: 24,
  },
  searchBtnDisabled: { opacity: 0.6 },
  searchBtnText:     { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  resultsSection:    { gap: 12 },
  poCard: {
    backgroundColor: '#ffffff', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  poCardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 6,
  },
  poNumber:  { fontSize: 18, fontWeight: '700', color: '#1e1b4b' },
  pkpBadge:  { backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  pkpBadgeText: { fontSize: 11, color: '#92400e', fontWeight: '700' },
  poVendor:  { fontSize: 14, color: '#374151', marginBottom: 10 },
  poFooter:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  poAmount:  { fontSize: 15, fontWeight: '700', color: '#059669' },
  poGroup:   { fontSize: 12, color: '#6366f1', fontWeight: '600' },
  ppnHint:   { fontSize: 11, color: '#9ca3af', marginBottom: 6 },
  poSelectHint: { fontSize: 12, color: '#6366f1', textAlign: 'right' },
  emptyBox:  { alignItems: 'center', paddingVertical: 32 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 22 },
});
