import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ActivityIndicator, Alert, Dimensions, ScrollView, TextInput,
  Modal, FlatList,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { searchPo } from '../api/po';
import { getCompanies } from '../api/receipt';
import { PoResult, Company } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCAN_BOX_SIZE = SCREEN_WIDTH * 0.75;

const normalizeDigits = (s: string) => s.replace(/\D/g, '');

function parseOcrText(raw: string): { poCandidates: string[]; tokens: string[] } {
  const tokens = raw.split(/\s+/).map(t => t.trim()).filter(Boolean);
  const poSet  = new Set<string>();

  for (const token of tokens) {
    const digits = normalizeDigits(token);
    if (/^4\d{9}$/.test(digits)) poSet.add(digits);
  }

  const digitRuns = raw.match(/[\d.,]+/g) ?? [];
  for (const run of digitRuns) {
    const digits = normalizeDigits(run);
    if (/^4\d{9}$/.test(digits)) poSet.add(digits);
  }

  return { poCandidates: Array.from(poSet), tokens };
}

const formatCurrency = (text: string) => {
  const clean = text.replace(/\D/g, '');
  return clean.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

type Mode = 'camera' | 'manual';

interface ManualState {
  tokens: string[];
  invoiceNo: string;
  poNo: string;
  amount: string;
  companyId: number | null;
  companyName: string;
}

export default function CameraOCRScreen() {
  const navigation = useNavigation<any>();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [mode, setMode]               = useState<Mode>('camera');
  const [scanning, setScanning]       = useState(false);
  const [searching, setSearching]     = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [flashOn, setFlashOn]         = useState(false);

  const [manual, setManual] = useState<ManualState>({
    tokens: [], invoiceNo: '', poNo: '', amount: '',
    companyId: null, companyName: '',
  });
  const [companies, setCompanies]                 = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies]   = useState(false);
  const [showCompanyPicker, setShowCompanyPicker] = useState(false);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  useEffect(() => {
    if (mode !== 'manual' || companies.length > 0) return;
    setLoadingCompanies(true);
    getCompanies()
      .then(setCompanies)
      .catch(() => Alert.alert('Error', 'Gagal memuat daftar perusahaan'))
      .finally(() => setLoadingCompanies(false));
  }, [mode]);

  // ── Capture & OCR ──────────────────────────────────────────────────────────

  const handleCapture = async () => {
    if (!cameraRef.current || scanning || searching) return;
    setScanning(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85, base64: false });
      if (!photo?.uri) throw new Error('Gagal mengambil foto');

      const result  = await TextRecognition.recognize(photo.uri);
      const rawText = result.text ?? '';

      if (!rawText.trim()) {
        Alert.alert('Tidak ada teks', 'Coba lagi dengan pencahayaan lebih baik.');
        return;
      }

      const { poCandidates, tokens } = parseOcrText(rawText);

      if (poCandidates.length === 0) {
        // Tidak ada kandidat PO — langsung manual mode dengan token
        enterManualMode(tokens);
        return;
      }

      if (poCandidates.length === 1) {
        await lookupPO(poCandidates[0], tokens);
        return;
      }

      // Multiple candidates — user pilih
      Alert.alert(
        'Pilih Nomor PO',
        'Beberapa nomor PO terdeteksi:',
        [
          ...poCandidates.map(po => ({
            text: po,
            onPress: () => lookupPO(po, tokens),
          })),
          { text: 'Input Manual', onPress: () => enterManualMode(tokens) },
          { text: 'Batal', style: 'cancel' as const },
        ]
      );
    } catch (err: any) {
      Alert.alert('Error OCR', err.message ?? 'Gagal memproses gambar');
    } finally {
      setScanning(false);
    }
  };

  // ── PO Lookup ──────────────────────────────────────────────────────────────

  const lookupPO = async (poNumber: string, tokens: string[] = []) => {
    if (poNumber === lastScanned) return;
    setLastScanned(poNumber);
    setSearching(true);
    try {
      const data = await searchPo(poNumber);

      if (!data || !data.found) {
        // PO tidak ditemukan di DB — masuk manual mode
        // pre-fill poNo + bawa semua token OCR
        setManual(prev => ({
          ...prev,
          tokens,
          poNo: poNumber,
          invoiceNo: '',
          amount: '',
        }));
        setMode('manual');
        setLastScanned(null);
        return;
      }

      // PO ditemukan — kirim ke ScanPOScreen untuk verifikasi
      navigation.navigate('ScanPO', { detectedPo: poNumber });

    } catch (err: any) {
      Alert.alert('Gagal', err?.response?.data?.message ?? 'Tidak dapat terhubung ke server');
      setLastScanned(null);
    } finally {
      setSearching(false);
    }
  };

  // ── Manual mode ────────────────────────────────────────────────────────────

  const enterManualMode = (tokens: string[]) => {
    setManual(prev => ({
      ...prev,
      tokens,
      invoiceNo: '',
      poNo: '',
      amount: '',
      companyId: null,
      companyName: '',
    }));
    setMode('manual');
  };

  const selectToken = (field: 'invoiceNo' | 'poNo', value: string) => {
    setManual(prev => ({ ...prev, [field]: value }));
  };

  const submitManual = () => {
    const { invoiceNo, poNo, amount, companyId, companyName } = manual;
    if (!companyId) {
      Alert.alert('Wajib', 'Perusahaan harus dipilih');
      return;
    }
    const amountNum = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    if (!amountNum || amountNum <= 0) {
      Alert.alert('Wajib', 'Masukkan nilai yang valid');
      return;
    }

    const partialPo: PoResult = {
      found:                false,
      po_number:            poNo,
      invoice_number:       invoiceNo,
      sap_vendor_id:        '',
      vendor_id:            0,
      vendor_name:          '',
      is_pkp:               false,
      sap_business_area_id: '',
      business_area_code:   '',
      buyer_name:           '',
      purc_grp:             '',
      dpp:                  amountNum,
      ppn:                  0,
      amount:               amountNum,
      company_id:           companyId,
      company_name:         companyName,
      items:                [],
    };

    navigation.replace('ReceiptForm', { po: partialPo });
  };

  // ── Render: permission ─────────────────────────────────────────────────────

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerBox}>
          <Text style={styles.permissionIcon}>📷</Text>
          <Text style={styles.permissionTitle}>Izin Kamera Diperlukan</Text>
          <Text style={styles.permissionDesc}>
            APPACC butuh akses kamera untuk scan nomor PO dari dokumen invoice.
          </Text>
          <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
            <Text style={styles.permissionBtnText}>Izinkan Akses Kamera</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Render: manual entry ───────────────────────────────────────────────────

  if (mode === 'manual') {
    return (
      <SafeAreaView style={[styles.container, styles.manualContainer]}>

        <View style={styles.manualHeader}>
          <TouchableOpacity onPress={() => setMode('camera')} style={styles.topBtn}>
            <Text style={styles.manualBackText}>← Scan Ulang</Text>
          </TouchableOpacity>
          <Text style={styles.manualTitle}>Entry Manual</Text>
          <View style={{ width: 80 }} />
        </View>

        <ScrollView
          style={styles.manualScroll}
          contentContainerStyle={styles.manualContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Token chips dari OCR */}
          {manual.tokens.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                Teks dari scan — tap untuk isi No. Invoice atau No. PO
              </Text>
              <View style={styles.chipRow}>
                {manual.tokens.slice(0, 40).map((token, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.chip}
                    onPress={() =>
                      Alert.alert(token, 'Gunakan sebagai:', [
                        { text: 'No. Invoice', onPress: () => selectToken('invoiceNo', token) },
                        { text: 'No. PO',      onPress: () => selectToken('poNo', token) },
                        { text: 'Batal', style: 'cancel' },
                      ])
                    }
                  >
                    <Text style={styles.chipText}>{token}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* No. Invoice */}
          <View style={styles.section}>
            <Text style={styles.fieldLabel}>No. Invoice</Text>
            <TextInput
              style={styles.input}
              value={manual.invoiceNo}
              onChangeText={v => setManual(p => ({ ...p, invoiceNo: v }))}
              placeholder="Pilih dari chip di atas atau ketik manual"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* No. PO */}
          <View style={styles.section}>
            <Text style={styles.fieldLabel}>No. PO</Text>
            <TextInput
              style={styles.input}
              value={manual.poNo}
              onChangeText={v => setManual(p => ({ ...p, poNo: v }))}
              placeholder="Pilih dari chip di atas atau ketik manual"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>

          {/* Perusahaan */}
          <View style={styles.section}>
            <Text style={styles.fieldLabel}>Perusahaan *</Text>
            {loadingCompanies ? (
              <ActivityIndicator color="#6366f1" style={{ marginTop: 8 }} />
            ) : (
              <TouchableOpacity
                style={[styles.input, styles.selectRow]}
                onPress={() => setShowCompanyPicker(true)}
              >
                <Text style={manual.companyId ? styles.inputText : styles.inputPlaceholder}>
                  {manual.companyName || 'Pilih perusahaan...'}
                </Text>
                <Text style={styles.selectArrow}>▼</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Nilai */}
          <View style={styles.section}>
            <Text style={styles.fieldLabel}>Nilai (Rp) *</Text>
            <View style={styles.inputPrefix}>
              <Text style={styles.prefixText}>Rp</Text>
              <TextInput
                style={styles.inputWithPrefix}
                value={manual.amount}
                onChangeText={v => setManual(p => ({ ...p, amount: formatCurrency(v) }))}
                placeholder="0"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.fieldHint}>Nilai aktual yang ditagih — bisa diubah di form berikutnya</Text>
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={submitManual}>
            <Text style={styles.submitBtnText}>Lanjut ke Form Penerimaan →</Text>
          </TouchableOpacity>

        </ScrollView>

        {/* Modal company picker */}
        <Modal
          visible={showCompanyPicker}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowCompanyPicker(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Perusahaan</Text>
              <TouchableOpacity onPress={() => setShowCompanyPicker(false)}>
                <Text style={styles.modalClose}>Tutup</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={companies}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setManual(p => ({ ...p, companyId: item.id, companyName: item.name }));
                    setShowCompanyPicker(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                  {manual.companyId === item.id && (
                    <Text style={styles.modalItemCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.modalSeparator} />}
            />
          </SafeAreaView>
        </Modal>

      </SafeAreaView>
    );
  }

  // ── Render: camera ─────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={flashOn}
      />

      <View style={styles.overlay}>
        <SafeAreaView>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBtn}>
              <Text style={styles.topBtnText}>✕ Tutup</Text>
            </TouchableOpacity>
            <Text style={styles.topTitle}>Scan Nomor PO</Text>
            <TouchableOpacity onPress={() => setFlashOn(!flashOn)} style={styles.topBtn}>
              <Text style={styles.topBtnText}>{flashOn ? '⚡ ON' : '⚡ OFF'}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={styles.scanArea}>
          <View style={styles.scanBox}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <Text style={styles.scanHint}>Arahkan nomor PO ke dalam kotak</Text>
          <Text style={styles.scanHint2}>Format: 45XXXXXXXX (10 digit), titik/koma diabaikan</Text>
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.manualBtn}
            onPress={() => enterManualMode([])}
          >
            <Text style={styles.manualBtnText}>Input{'\n'}Manual</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.captureBtn, (scanning || searching) && styles.captureBtnDisabled]}
            onPress={handleCapture}
            disabled={scanning || searching}
          >
            {scanning || searching
              ? <ActivityIndicator color="#ffffff" size="large" />
              : <View style={styles.captureBtnInner} />
            }
          </TouchableOpacity>

          <View style={{ width: 80 }} />
        </View>
      </View>

      {searching && (
        <View style={styles.searchingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.searchingText}>Mencari PO...</Text>
        </View>
      )}
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#000' },
  centerBox:       { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  overlay:         { flex: 1, justifyContent: 'space-between' },

  permissionIcon:    { fontSize: 48, marginBottom: 16, textAlign: 'center' },
  permissionTitle:   { fontSize: 20, fontWeight: '700', color: '#1e1b4b', textAlign: 'center', marginBottom: 8 },
  permissionDesc:    { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  permissionBtn:     { backgroundColor: '#6366f1', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  permissionBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: 'rgba(0,0,0,0.5)',
  },
  topBtn:     { paddingHorizontal: 12, paddingVertical: 8 },
  topBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  topTitle:   { color: '#ffffff', fontSize: 16, fontWeight: '700' },

  scanArea:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanBox:   { width: SCAN_BOX_SIZE, height: SCAN_BOX_SIZE * 0.5, position: 'relative' },
  corner:    { position: 'absolute', width: 24, height: 24, borderColor: '#6366f1', borderWidth: 3 },
  cornerTL:  { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR:  { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL:  { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR:  { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  scanHint:  { color: '#ffffff', fontSize: 13, marginTop: 16, textAlign: 'center', opacity: 0.8 },
  scanHint2: { color: '#ffffff', fontSize: 11, marginTop: 4, textAlign: 'center', opacity: 0.5 },

  bottomBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingBottom: 48, paddingTop: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  manualBtn:          { width: 80, alignItems: 'center' },
  manualBtnText:      { color: '#ffffff', fontSize: 12, textAlign: 'center', opacity: 0.8 },
  captureBtn: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: '#6366f1',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 4, borderColor: 'rgba(255,255,255,0.4)',
  },
  captureBtnDisabled: { opacity: 0.5 },
  captureBtnInner:    { width: 52, height: 52, borderRadius: 26, backgroundColor: '#ffffff' },

  searchingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center', alignItems: 'center', gap: 16,
  },
  searchingText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },

  // Manual mode
  manualContainer: { backgroundColor: '#f9fafb' },
  manualHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb',
  },
  manualBackText: { color: '#6366f1', fontSize: 14, fontWeight: '600' },
  manualTitle:    { fontSize: 16, fontWeight: '700', color: '#111827' },
  manualScroll:   { flex: 1 },
  manualContent:  { padding: 16, paddingBottom: 48 },

  section:      { marginBottom: 20 },
  sectionLabel: { fontSize: 12, color: '#6b7280', marginBottom: 8, fontWeight: '500' },
  fieldLabel:   { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  fieldHint:    { fontSize: 11, color: '#9ca3af', marginTop: 4 },

  input: {
    backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#d1d5db',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: '#111827', minHeight: 48,
    justifyContent: 'center',
  },
  selectRow:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectArrow:      { fontSize: 12, color: '#6b7280', marginLeft: 8 },
  inputText:        { fontSize: 15, color: '#111827', flex: 1 },
  inputPlaceholder: { fontSize: 15, color: '#9ca3af', flex: 1 },

  inputPrefix: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#d1d5db',
    borderRadius: 10, overflow: 'hidden',
  },
  prefixText: {
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: '#6b7280', fontWeight: '600',
    borderRightWidth: 1, borderRightColor: '#d1d5db',
  },
  inputWithPrefix: {
    flex: 1, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: '#111827',
  },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#ede9fe', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  chipText: { fontSize: 13, color: '#4c1d95', fontWeight: '500' },

  submitBtn: {
    backgroundColor: '#6366f1', borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginTop: 8,
  },
  submitBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },

  // Modal
  modalContainer: { flex: 1, backgroundColor: '#ffffff' },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: '#e5e7eb',
  },
  modalTitle:     { fontSize: 16, fontWeight: '700', color: '#111827' },
  modalClose:     { fontSize: 15, color: '#6366f1', fontWeight: '600' },
  modalItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16,
  },
  modalItemText:  { fontSize: 15, color: '#111827', flex: 1 },
  modalItemCheck: { fontSize: 16, color: '#6366f1', fontWeight: '700' },
  modalSeparator: { height: 1, backgroundColor: '#f3f4f6', marginHorizontal: 20 },
});