import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ActivityIndicator, Alert, Dimensions, ScrollView, TextInput,
  Modal, FlatList,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { searchPo } from '../api/po';
import { getCompanies, getVendors, Vendor } from '../api/receipt';
import { PoResult, Company } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCAN_BOX_SIZE = SCREEN_WIDTH * 0.75;
const SCAN_INTERVAL_MS = 1500;

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
  vendorId: number | null;
  vendorName: string;
}

export default function CameraOCRScreen() {
  const navigation = useNavigation<any>();

  // Vision Camera v5
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);

  const [mode, setMode]             = useState<Mode>('camera');
  const [searching, setSearching]   = useState(false);
  const [flashOn, setFlashOn]       = useState(false);
  const [scanStatus, setScanStatus] = useState('Mengarahkan kamera...');
  const [isActive, setIsActive]     = useState(true);

  const isProcessing  = useRef(false);
  const lastPoScanned = useRef<string | null>(null);
  const scanTimer     = useRef<ReturnType<typeof setInterval> | null>(null);

  const [manual, setManual] = useState<ManualState>({
    tokens: [], invoiceNo: '', poNo: '', amount: '',
    companyId: null, companyName: '',
    vendorId: null, vendorName: '',
  });

  const [companies, setCompanies]                 = useState<Company[]>([]);
  const [vendors, setVendors]                     = useState<Vendor[]>([]);
  const [loadingCompanies, setLoadingCompanies]   = useState(false);
  const [loadingVendors, setLoadingVendors]       = useState(false);
  const [showCompanyPicker, setShowCompanyPicker] = useState(false);
  const [showVendorPicker, setShowVendorPicker]   = useState(false);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, []);

  useEffect(() => {
    if (mode === 'camera' && hasPermission) {
      setIsActive(true);
      startScanLoop();
    } else {
      setIsActive(false);
      stopScanLoop();
    }
    return () => stopScanLoop();
  }, [mode, hasPermission]);

  useEffect(() => {
    if (mode !== 'manual') return;
    if (companies.length === 0) {
      setLoadingCompanies(true);
      getCompanies()
        .then(setCompanies)
        .catch(() => Alert.alert('Error', 'Gagal memuat perusahaan'))
        .finally(() => setLoadingCompanies(false));
    }
    if (vendors.length === 0) {
      setLoadingVendors(true);
      getVendors()
        .then(setVendors)
        .catch(() => Alert.alert('Error', 'Gagal memuat vendor'))
        .finally(() => setLoadingVendors(false));
    }
  }, [mode]);

  // ── Scan loop ──────────────────────────────────────────────────────────────

  const startScanLoop = () => {
    stopScanLoop();
    scanTimer.current = setInterval(runOcrFrame, SCAN_INTERVAL_MS);
  };

  const stopScanLoop = () => {
    if (scanTimer.current) {
      clearInterval(scanTimer.current);
      scanTimer.current = null;
    }
  };

  const runOcrFrame = useCallback(async () => {
    if (!cameraRef.current || isProcessing.current) return;
    isProcessing.current = true;

    try {
      // takeSnapshot — SILENT, tidak trigger shutter Samsung
      const snapshot = await cameraRef.current.takeSnapshot({
        quality: 60,       // 0-100, lebih rendah = lebih cepat
        skipMetadata: true,
      });

      const uri = snapshot.path.startsWith('file://')
        ? snapshot.path
        : `file://${snapshot.path}`;

      const result  = await TextRecognition.recognize(uri);
      const rawText = result.text ?? '';

      if (!rawText.trim()) {
        setScanStatus('Tidak ada teks — arahkan ke dokumen');
        return;
      }

      const { poCandidates, tokens } = parseOcrText(rawText);

      if (poCandidates.length === 0) {
        setScanStatus('Teks terdeteksi — PO belum ditemukan');
        setManual(prev => ({ ...prev, tokens }));
        return;
      }

      const poNumber = poCandidates[0];
      if (poNumber === lastPoScanned.current) return;
      lastPoScanned.current = poNumber;

      setScanStatus(`PO terdeteksi: ${poNumber}`);
      stopScanLoop();
      setIsActive(false);
      setSearching(true);

      const data = await searchPo(poNumber);

      if (!data || !data.found) {
        setManual(prev => ({ ...prev, poNo: poNumber }));
        setMode('manual');
        lastPoScanned.current = null;
        return;
      }

      navigation.navigate('ScanPO', { detectedPo: poNumber });

    } catch {
      // silent fail
    } finally {
      isProcessing.current = false;
      setSearching(false);
    }
  }, [navigation]);

  // ── Manual helpers ─────────────────────────────────────────────────────────

  const enterManualMode = () => {
    stopScanLoop();
    setIsActive(false);
    setManual(prev => ({
      ...prev,
      invoiceNo: '', poNo: '', amount: '',
      companyId: null, companyName: '',
      vendorId: null, vendorName: '',
    }));
    setMode('manual');
  };

  const selectToken = (field: 'invoiceNo' | 'poNo', value: string) => {
    setManual(prev => ({ ...prev, [field]: value }));
  };

  const submitManual = () => {
    const { invoiceNo, poNo, amount, companyId, companyName, vendorId, vendorName } = manual;
    if (!vendorId)  { Alert.alert('Wajib', 'Vendor harus dipilih'); return; }
    if (!companyId) { Alert.alert('Wajib', 'Perusahaan harus dipilih'); return; }
    const amountNum = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    if (!amountNum || amountNum <= 0) { Alert.alert('Wajib', 'Masukkan nilai yang valid'); return; }

    const partialPo: PoResult = {
      found:                false,
      po_number:            poNo,
      invoice_number:       invoiceNo,
      sap_vendor_id:        '',
      vendor_id:            vendorId,
      vendor_name:          vendorName,
      is_pkp:               vendors.find(v => v.id === vendorId)?.is_pkp ?? false,
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

  if (!hasPermission) {
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

  if (!device) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.permissionDesc}>Memuat kamera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Render: manual entry ───────────────────────────────────────────────────

  if (mode === 'manual') {
    return (
      <SafeAreaView style={[styles.container, styles.manualContainer]}>
        <View style={styles.manualHeader}>
          <TouchableOpacity
            onPress={() => {
              lastPoScanned.current = null;
              setMode('camera');
            }}
            style={styles.topBtn}
          >
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
          {/* Token chips */}
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
              placeholder="Pilih dari chip atau ketik manual"
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
              placeholder="Pilih dari chip atau ketik manual"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>

          {/* Vendor */}
          <View style={styles.section}>
            <Text style={styles.fieldLabel}>Vendor *</Text>
            {loadingVendors ? (
              <ActivityIndicator color="#6366f1" style={{ marginTop: 8 }} />
            ) : (
              <TouchableOpacity
                style={[styles.input, styles.selectRow]}
                onPress={() => setShowVendorPicker(true)}
              >
                <Text style={manual.vendorId ? styles.inputText : styles.inputPlaceholder}>
                  {manual.vendorName || 'Pilih vendor...'}
                </Text>
                <Text style={styles.selectArrow}>▼</Text>
              </TouchableOpacity>
            )}
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

        {/* Modal vendor */}
        <Modal
          visible={showVendorPicker}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowVendorPicker(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Vendor</Text>
              <TouchableOpacity onPress={() => setShowVendorPicker(false)}>
                <Text style={styles.modalClose}>Tutup</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={vendors}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setManual(p => ({ ...p, vendorId: item.id, vendorName: item.name }));
                    setShowVendorPicker(false);
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalItemText}>{item.name}</Text>
                    {item.npwp ? <Text style={styles.modalItemSub}>{item.npwp}</Text> : null}
                  </View>
                  {manual.vendorId === item.id && (
                    <Text style={styles.modalItemCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.modalSeparator} />}
            />
          </SafeAreaView>
        </Modal>

        {/* Modal company */}
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

  // ── Render: camera (auto-scan, silent) ────────────────────────────────────

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        device={device}
        isActive={isActive}
        torch={flashOn ? 'on' : 'off'}
        photo={true}
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
          <Text style={styles.scanStatus}>{scanStatus}</Text>
          {searching && (
            <View style={styles.searchingBadge}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.searchingBadgeText}>Mencari PO di database...</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.manualBtn} onPress={enterManualMode}>
            <Text style={styles.manualBtnText}>Input{'\n'}Manual</Text>
          </TouchableOpacity>
          <View style={styles.scanIndicator}>
            <ActivityIndicator size="small" color="#6366f1" />
            <Text style={styles.scanIndicatorText}>Auto scan</Text>
          </View>
          <View style={{ width: 80 }} />
        </View>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

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
  scanBox: {
    width: SCAN_BOX_SIZE, height: SCAN_BOX_SIZE * 0.5,
    position: 'relative', justifyContent: 'center', alignItems: 'center',
  },
  corner:    { position: 'absolute', width: 24, height: 24, borderColor: '#6366f1', borderWidth: 3 },
  cornerTL:  { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR:  { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL:  { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR:  { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },

  scanHint:   { color: '#ffffff', fontSize: 13, marginTop: 16, textAlign: 'center', opacity: 0.8 },
  scanStatus: { color: '#a5b4fc', fontSize: 12, marginTop: 6, textAlign: 'center' },
  searchingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(99,102,241,0.8)', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 8, marginTop: 12,
  },
  searchingBadgeText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },

  bottomBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingBottom: 48, paddingTop: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  manualBtn:         { width: 80, alignItems: 'center' },
  manualBtnText:     { color: '#ffffff', fontSize: 12, textAlign: 'center', opacity: 0.8 },
  scanIndicator:     { alignItems: 'center', gap: 6 },
  scanIndicatorText: { color: '#6366f1', fontSize: 11, fontWeight: '600' },

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
    fontSize: 15, color: '#111827', minHeight: 48, justifyContent: 'center',
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
    paddingHorizontal: 20, paddingVertical: 14,
  },
  modalItemText:  { fontSize: 15, color: '#111827' },
  modalItemSub:   { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  modalItemCheck: { fontSize: 16, color: '#6366f1', fontWeight: '700' },
  modalSeparator: { height: 1, backgroundColor: '#f3f4f6', marginHorizontal: 20 },
});