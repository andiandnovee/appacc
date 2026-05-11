import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getStages, getCompanies, storeReceipt, Company } from '../api/receipt';
import { PoResult, Stage, ReceiptPayload } from '../types';

export default function ReceiptFormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const po: PoResult = route.params?.po;

  const [stages, setStages] = useState<Stage[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [receiptDate, setReceiptDate] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showStageList, setShowStageList] = useState(false);
  const [showCompanyList, setShowCompanyList] = useState(false);

  useEffect(() => {
    loadFormData();
    // Pre-fill amount dari PO
    if (po?.amount) {
      setAmount(formatCurrency(String(Math.round(po.amount))));
    }
  }, []);

  const loadFormData = async () => {
    try {
      const [stageData, companyData] = await Promise.all([
        getStages(),
        getCompanies(),
      ]);
      setStages(stageData);
      setCompanies(companyData);

      // Auto-select company pertama kalau hanya 1
      if (companyData.length === 1) {
        setSelectedCompany(companyData[0]);
      }
    } catch (error) {
      Alert.alert('Gagal', 'Tidak dapat memuat data form');
    } finally {
      setLoadingData(false);
    }
  };

  const formatCurrency = (text: string) => {
    const clean = text.replace(/\D/g, '');
    return clean.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleAmountChange = (text: string) => {
    setAmount(formatCurrency(text));
  };

  const handleDateChange = (text: string) => {
    // Auto format: 20250101 → 2025-01-01
    const clean = text.replace(/\D/g, '');
    if (clean.length <= 4) {
      setReceiptDate(clean);
    } else if (clean.length <= 6) {
      setReceiptDate(`${clean.slice(0, 4)}-${clean.slice(4)}`);
    } else {
      setReceiptDate(`${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`);
    }
  };

  const handleSubmit = async () => {
    if (!receiptDate.trim()) return Alert.alert('Perhatian', 'Tanggal penerimaan wajib diisi');
    if (!amount.trim()) return Alert.alert('Perhatian', 'Nilai invoice wajib diisi');
    if (!selectedStage) return Alert.alert('Perhatian', 'Stage wajib dipilih');
    if (!selectedCompany) return Alert.alert('Perhatian', 'Perusahaan wajib dipilih');

    // Validasi format tanggal
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(receiptDate)) {
      return Alert.alert('Perhatian', 'Format tanggal: YYYY-MM-DD');
    }

    const amountClean = Number(amount.replace(/\./g, ''));
    if (isNaN(amountClean) || amountClean <= 0) {
      return Alert.alert('Perhatian', 'Nilai tidak valid');
    }

    setSubmitting(true);
    try {
      const payload: ReceiptPayload = {
        receipt_date: receiptDate,
        vendor_id: po.vendor_id,
        po_number: po.po_number,
        amount: amountClean,
        company_id: selectedCompany.id,
        stage_id: selectedStage.id,
        pgr_id: po.purc_grp || undefined,
        business_area_code: po.sap_business_area_id || undefined,
        invoice_number: invoiceNumber.trim() || undefined,
      };

      await storeReceipt(payload);

      Alert.alert(
        '✅ Berhasil',
        'Invoice receipt berhasil disimpan',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch (error: any) {
      const errors = error?.response?.data?.errors;
      const msg = errors
        ? Object.values(errors).flat().join('\n')
        : error?.response?.data?.message ?? 'Gagal menyimpan receipt';
      Alert.alert('Gagal', msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Memuat data form...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Input Receipt</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* PO Info Card */}
        <View style={styles.poCard}>
          <Text style={styles.poCardLabel}>DATA PO</Text>
          <Text style={styles.poNumber}>{po?.po_number}</Text>
          <Text style={styles.poVendor}>{po?.vendor_name}</Text>
          <View style={styles.poRow}>
            <Text style={styles.poAmount}>
              Rp {Number(po?.amount ?? 0).toLocaleString('id-ID')}
            </Text>
            {po?.is_pkp && (
              <View style={styles.pkpBadge}>
                <Text style={styles.pkpBadgeText}>PKP</Text>
              </View>
            )}
            <Text style={styles.poGroup}>{po?.purc_grp}</Text>
          </View>
        </View>

        {/* No Invoice */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>No. Invoice</Text>
          <TextInput
            style={styles.input}
            placeholder="Opsional"
            placeholderTextColor="#9ca3af"
            value={invoiceNumber}
            onChangeText={setInvoiceNumber}
          />
        </View>

        {/* Tanggal Penerimaan */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Tanggal Penerimaan <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9ca3af"
            value={receiptDate}
            onChangeText={handleDateChange}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        {/* Nilai Invoice */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nilai Invoice <Text style={styles.required}>*</Text></Text>
          <View style={styles.inputPrefix}>
            <Text style={styles.prefixText}>Rp</Text>
            <TextInput
              style={styles.inputWithPrefix}
              placeholder="0"
              placeholderTextColor="#9ca3af"
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Perusahaan */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Perusahaan <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity
            style={styles.selectBtn}
            onPress={() => {
              setShowCompanyList(!showCompanyList);
              setShowStageList(false);
            }}
          >
            <Text style={[styles.selectBtnText, !selectedCompany && styles.selectPlaceholder]}>
              {selectedCompany ? selectedCompany.name : 'Pilih perusahaan...'}
            </Text>
            <Text style={styles.selectArrow}>{showCompanyList ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showCompanyList && (
            <View style={styles.dropdownList}>
              {companies.map((company) => (
                <TouchableOpacity
                  key={company.id}
                  style={[
                    styles.dropdownItem,
                    selectedCompany?.id === company.id && styles.dropdownItemActive,
                  ]}
                  onPress={() => {
                    setSelectedCompany(company);
                    setShowCompanyList(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    selectedCompany?.id === company.id && styles.dropdownItemTextActive,
                  ]}>
                    {company.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Stage */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Stage <Text style={styles.required}>*</Text></Text>
          <TouchableOpacity
            style={styles.selectBtn}
            onPress={() => {
              setShowStageList(!showStageList);
              setShowCompanyList(false);
            }}
          >
            <Text style={[styles.selectBtnText, !selectedStage && styles.selectPlaceholder]}>
              {selectedStage ? `${selectedStage.name} (${selectedStage.year})` : 'Pilih stage...'}
            </Text>
            <Text style={styles.selectArrow}>{showStageList ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showStageList && (
            <View style={styles.dropdownList}>
              <ScrollView nestedScrollEnabled style={{ maxHeight: 220 }}>
                {stages.map((stage) => (
                  <TouchableOpacity
                    key={stage.id}
                    style={[
                      styles.dropdownItem,
                      selectedStage?.id === stage.id && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setSelectedStage(stage);
                      setShowStageList(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      selectedStage?.id === stage.id && styles.dropdownItemTextActive,
                    ]}>
                      {stage.name}
                    </Text>
                    <Text style={styles.stageYear}>{stage.year}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitBtnText}>Simpan Receipt</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#6b7280' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: { width: 80 },
  backText: { fontSize: 14, color: '#6366f1', fontWeight: '600' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#1e1b4b' },
  content: { padding: 24 },
  poCard: {
    backgroundColor: '#1e1b4b',
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
  },
  poCardLabel: {
    fontSize: 10,
    color: '#a5b4fc',
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  poNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  poVendor: { fontSize: 13, color: '#c7d2fe', marginBottom: 10 },
  poRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  poAmount: { fontSize: 14, fontWeight: '700', color: '#86efac' },
  pkpBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pkpBadgeText: { fontSize: 11, color: '#92400e', fontWeight: '700' },
  poGroup: { fontSize: 12, color: '#a5b4fc' },
  fieldGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  required: { color: '#dc2626' },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111827',
  },
  inputPrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  prefixText: {
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '600',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
    paddingVertical: 14,
  },
  inputWithPrefix: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111827',
  },
  selectBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectBtnText: { fontSize: 15, color: '#111827', flex: 1 },
  selectPlaceholder: { color: '#9ca3af' },
  selectArrow: { fontSize: 12, color: '#6b7280' },
  dropdownList: {
    marginTop: 4,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownItemActive: { backgroundColor: '#eef2ff' },
  dropdownItemText: { fontSize: 14, color: '#374151', flex: 1 },
  dropdownItemTextActive: { color: '#6366f1', fontWeight: '600' },
  stageYear: { fontSize: 12, color: '#9ca3af' },
  submitBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});
