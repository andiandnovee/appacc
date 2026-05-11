import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { searchPo } from '../api/po';
import { PoResult } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCAN_BOX_SIZE = SCREEN_WIDTH * 0.75;

// Regex untuk nomor PO SAP — biasanya 10 digit, awalan 45
const PO_PATTERNS = [
  /\b45\d{8}\b/g,       // SAP PO: 4500012345
  /\b4[0-9]{9}\b/g,     // PO 10 digit awalan 4
  /\bPO[:\s#-]*(\d{8,12})\b/gi, // "PO: 12345678" atau "PO#12345"
];

export default function CameraOCRScreen() {
  const navigation = useNavigation<any>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning]         = useState(false);
  const [searching, setSearching]       = useState(false);
  const [lastScanned, setLastScanned]   = useState<string | null>(null);
  const [flashOn, setFlashOn]           = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  // Extract PO candidates dari raw OCR text
  const extractPoCandidates = (text: string): string[] => {
    const candidates = new Set<string>();
    for (const pattern of PO_PATTERNS) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        // Kalau ada capture group (pattern ke-3), ambil group 1
        const po = match[1] ?? match[0];
        candidates.add(po.replace(/\D/g, ''));
      }
    }
    return Array.from(candidates);
  };

  const handleCapture = async () => {
    if (!cameraRef.current || scanning || searching) return;

    setScanning(true);
    try {
      // Ambil foto
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (!photo?.uri) throw new Error('Gagal mengambil foto');

      // OCR
      const result = await TextRecognition.recognize(photo.uri);
      const rawText = result.text ?? '';

      if (!rawText.trim()) {
        Alert.alert('Tidak ada teks', 'Tidak ada teks yang terdeteksi. Coba lagi dengan pencahayaan lebih baik.');
        return;
      }

      // Extract PO candidates
      const candidates = extractPoCandidates(rawText);

      if (candidates.length === 0) {
        // Tidak ada PO yang cocok — tampilkan semua teks untuk debugging
        Alert.alert(
          'PO Tidak Terdeteksi',
          `Teks terdeteksi:\n${rawText.slice(0, 200)}\n\nCoba arahkan kamera lebih dekat ke nomor PO.`,
          [{ text: 'OK' }]
        );
        return;
      }

      if (candidates.length === 1) {
        // Langsung lookup
        await lookupPO(candidates[0]);
      } else {
        // Ada beberapa kandidat — minta user pilih
        Alert.alert(
          'Pilih Nomor PO',
          'Beberapa nomor PO terdeteksi:',
          [
            ...candidates.map(po => ({
              text: po,
              onPress: () => lookupPO(po),
            })),
            { text: 'Batal', style: 'cancel' as const },
          ]
        );
      }

    } catch (error: any) {
      Alert.alert('Error OCR', error.message ?? 'Gagal memproses gambar');
    } finally {
      setScanning(false);
    }
  };

  const lookupPO = async (poNumber: string) => {
    if (poNumber === lastScanned) return;
    setLastScanned(poNumber);
    setSearching(true);

    try {
      const data = await searchPo(poNumber);

      if (!data || !data.found) {
        Alert.alert(
          'PO Tidak Ditemukan',
          `Nomor PO ${poNumber} tidak ada di database.\n\nMau coba nomor lain?`,
          [
            { text: 'Scan Ulang', onPress: () => setLastScanned(null) },
            { text: 'Input Manual', onPress: () => navigation.goBack() },
          ]
        );
        return;
      }

      // Sukses — navigasi ke receipt form
      navigation.replace('ReceiptForm', { po: data });

    } catch (error: any) {
      Alert.alert('Gagal', error?.response?.data?.message ?? 'Tidak dapat terhubung ke server');
      setLastScanned(null);
    } finally {
      setSearching(false);
    }
  };

  // Permission belum granted
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

  return (
    <View style={styles.container}>
      {/* Camera */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={flashOn}
      />

      {/* Overlay */}
      <View style={styles.overlay}>

        {/* Header */}
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

        {/* Scan frame */}
        <View style={styles.scanArea}>
          <View style={styles.scanBox}>
            {/* Corner markers */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <Text style={styles.scanHint}>
            Arahkan nomor PO ke dalam kotak
          </Text>
        </View>

        {/* Bottom controls */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.manualBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.manualBtnText}>Input Manual</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.captureBtn, (scanning || searching) && styles.captureBtnDisabled]}
            onPress={handleCapture}
            disabled={scanning || searching}
          >
            {scanning || searching ? (
              <ActivityIndicator color="#ffffff" size="large" />
            ) : (
              <View style={styles.captureBtnInner} />
            )}
          </TouchableOpacity>

          <View style={{ width: 80 }} />
        </View>

      </View>

      {/* Loading overlay */}
      {searching && (
        <View style={styles.searchingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.searchingText}>Mencari PO...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#000' },
  centerBox:   { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  overlay:     { flex: 1, justifyContent: 'space-between' },

  // Permission
  permissionIcon:    { fontSize: 48, marginBottom: 16, textAlign: 'center' },
  permissionTitle:   { fontSize: 20, fontWeight: '700', color: '#1e1b4b', textAlign: 'center', marginBottom: 8 },
  permissionDesc:    { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  permissionBtn:     { backgroundColor: '#6366f1', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  permissionBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },

  // Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  topBtn:      { paddingHorizontal: 12, paddingVertical: 8 },
  topBtnText:  { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  topTitle:    { color: '#ffffff', fontSize: 16, fontWeight: '700' },

  // Scan area
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBox: {
    width: SCAN_BOX_SIZE,
    height: SCAN_BOX_SIZE * 0.5,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#6366f1',
    borderWidth: 3,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  scanHint: {
    color: '#ffffff',
    fontSize: 13,
    marginTop: 16,
    textAlign: 'center',
    opacity: 0.8,
  },

  // Bottom bar
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 48,
    paddingTop: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  manualBtn:     { width: 80, alignItems: 'center' },
  manualBtnText: { color: '#ffffff', fontSize: 12, textAlign: 'center', opacity: 0.8 },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  captureBtnDisabled: { opacity: 0.5 },
  captureBtnInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ffffff',
  },

  // Searching overlay
  searchingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  searchingText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
