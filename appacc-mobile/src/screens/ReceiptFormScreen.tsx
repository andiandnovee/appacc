import React, { useState, useEffect } from "react";
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
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getStages, storeReceipt } from "../api/receipt";
import { PoResult, Stage, ReceiptPayload } from "../types";
import useStageStore from "../store/useStageStore";

const today = () => new Date().toISOString().split("T")[0]; // YYYY-MM-DD

export default function ReceiptFormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const po: PoResult = route.params?.po;

  const [stages, setStages] = useState<Stage[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [receiptDate, setReceiptDate] = useState(today());
  const [amount, setAmount] = useState("");
  const { selectedStage, setSelectedStage } = useStageStore();

  const [showStageList, setShowStageList] = useState(false);

  useEffect(() => {
    loadStages();
    // Pre-fill amount dari PO (sudah include PPN kalau is_pkp)
    if (po?.amount) {
      setAmount(formatCurrency(String(Math.round(po.amount))));
    }
  }, []);

  const loadStages = async () => {
    try {
      const data = await getStages();
      setStages(data);
    } catch {
      Alert.alert("Gagal", "Tidak dapat memuat data stage");
    } finally {
      setLoadingData(false);
    }
  };

  const formatCurrency = (text: string) => {
    const clean = text.replace(/\D/g, "");
    return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleAmountChange = (text: string) => {
    setAmount(formatCurrency(text));
  };

  const handleDateChange = (text: string) => {
    const clean = text.replace(/\D/g, "");
    if (clean.length <= 4) {
      setReceiptDate(clean);
    } else if (clean.length <= 6) {
      setReceiptDate(`${clean.slice(0, 4)}-${clean.slice(4)}`);
    } else {
      setReceiptDate(
        `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`,
      );
    }
  };

  const handleSubmit = async () => {
    if (!receiptDate.trim())
      return Alert.alert("Perhatian", "Tanggal wajib diisi");
    if (!amount.trim()) return Alert.alert("Perhatian", "Nilai wajib diisi");
    if (!selectedStage) return Alert.alert("Perhatian", "Stage wajib dipilih");
    if (!po.company_id)
      return Alert.alert("Perhatian", "Company tidak ditemukan dari data PO");
    if (!po.vendor_id)
      return Alert.alert("Perhatian", "Vendor tidak ditemukan dari data PO");

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(receiptDate)) {
      return Alert.alert("Perhatian", "Format tanggal: YYYY-MM-DD");
    }

    const amountClean = Number(amount.replace(/\./g, ""));
    if (isNaN(amountClean) || amountClean <= 0) {
      return Alert.alert("Perhatian", "Nilai tidak valid");
    }

    setSubmitting(true);
    try {
      const payload: ReceiptPayload = {
        receipt_date: receiptDate,
        vendor_id: po.vendor_id,
        po_number: po.po_number,
        amount: amountClean,
        company_id: po.company_id,
        stage_id: selectedStage.id,
        pgr_id: po.purc_grp || undefined,
        business_area_code: po.business_area_code || undefined,
        invoice_number: invoiceNumber.trim() || undefined,
      };

      await storeReceipt(payload);

      Alert.alert("✅ Berhasil", "Invoice receipt berhasil disimpan", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ]);
    } catch (error: any) {
      const errors = error?.response?.data?.errors;
      const msg = errors
        ? Object.values(errors).flat().join("\n")
        : (error?.response?.data?.message ?? "Gagal menyimpan receipt");
      Alert.alert("Gagal", msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Input Receipt</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* PO Info Card */}
        <View style={styles.poCard}>
          <Text style={styles.poCardLabel}>DATA PO</Text>
          <Text style={styles.poNumber}>{po?.po_number}</Text>
          <Text style={styles.poVendor}>{po?.vendor_name}</Text>

          {/* Amount breakdown */}
          <View style={styles.amountBox}>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>DPP</Text>
              <Text style={styles.amountValue}>
                Rp {Number(po?.dpp ?? 0).toLocaleString("id-ID")}
              </Text>
            </View>
            {po?.is_pkp && (
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>PPN 11%</Text>
                <Text style={styles.amountPpn}>
                  + Rp {Number(po?.ppn ?? 0).toLocaleString("id-ID")}
                </Text>
              </View>
            )}
            <View style={[styles.amountRow, styles.amountTotal]}>
              <Text style={styles.amountTotalLabel}>Total</Text>
              <Text style={styles.amountTotalValue}>
                Rp {Number(po?.amount ?? 0).toLocaleString("id-ID")}
              </Text>
            </View>
          </View>

          {/* Badges */}
          <View style={styles.badgeRow}>
            {po?.is_pkp && (
              <View style={styles.pkpBadge}>
                <Text style={styles.pkpBadgeText}>PKP ✓</Text>
              </View>
            )}
            <Text style={styles.poGroup}>{po?.purc_grp}</Text>
            {po?.company_name && (
              <View style={styles.companyBadge}>
                <Text style={styles.companyBadgeText}>{po.company_name}</Text>
              </View>
            )}
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

        {/* Tanggal — auto hari ini, bisa diubah */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Tanggal Penerimaan <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9ca3af"
            value={receiptDate}
            onChangeText={handleDateChange}
            keyboardType="numeric"
            maxLength={10}
          />
          <Text style={styles.fieldHint}>Default: hari ini</Text>
        </View>

        {/* Nilai Invoice — auto dari PO, bisa diubah */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Nilai Invoice <Text style={styles.required}>*</Text>
          </Text>
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
          <Text style={styles.fieldHint}>
            {po?.found === false
              ? "Masukkan nilai aktual yang ditagih"
              : `Nilai PO: Rp ${Number(po.amount).toLocaleString("id-ID")}${
                  po.is_pkp ? " (sudah termasuk PPN 11%)" : ""
                } — ubah jika tagihan parsial`}
          </Text>
        </View>

        {/* Stage */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Stage <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.selectBtn}
            onPress={() => setShowStageList(!showStageList)}
          >
            <Text
              style={[
                styles.selectBtnText,
                !selectedStage && styles.selectPlaceholder,
              ]}
            >
              {selectedStage
                ? `${selectedStage.name} (${selectedStage.year})`
                : "Pilih stage..."}
            </Text>
            <Text style={styles.selectArrow}>{showStageList ? "▲" : "▼"}</Text>
          </TouchableOpacity>

          {showStageList && (
            <View style={styles.dropdownList}>
              <ScrollView nestedScrollEnabled style={{ maxHeight: 220 }}>
                {stages.map((stage) => (
                  <TouchableOpacity
                    key={stage.id}
                    style={[
                      styles.dropdownItem,
                      selectedStage?.id === stage.id &&
                        styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setSelectedStage(stage);
                      setShowStageList(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedStage?.id === stage.id &&
                          styles.dropdownItemTextActive,
                      ]}
                    >
                      {stage.name}
                    </Text>
                    <Text style={styles.stageYear}>{stage.year}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Info auto-filled */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Data otomatis dari PO:</Text>
          <Text style={styles.infoItem}>
            🏢 Perusahaan: {po?.company_name ?? "-"}
          </Text>
          <Text style={styles.infoItem}>
            🏭 Business Area: {po?.sap_business_area_id ?? "-"}
          </Text>
          <Text style={styles.infoItem}>👤 Buyer: {po?.buyer_name ?? "-"}</Text>
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
  container: { flex: 1, backgroundColor: "#f8fafc" },
  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: { fontSize: 14, color: "#6b7280" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backBtn: { width: 80 },
  backText: { fontSize: 14, color: "#6366f1", fontWeight: "600" },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#1e1b4b" },
  content: { padding: 24 },
  poCard: {
    backgroundColor: "#1e1b4b",
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
  },
  poCardLabel: {
    fontSize: 10,
    color: "#a5b4fc",
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  poNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  poVendor: { fontSize: 13, color: "#c7d2fe", marginBottom: 12 },
  amountBox: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  amountLabel: { fontSize: 13, color: "#a5b4fc" },
  amountValue: { fontSize: 13, color: "#ffffff", fontWeight: "600" },
  amountPpn: { fontSize: 13, color: "#fcd34d", fontWeight: "600" },
  amountTotal: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    paddingTop: 8,
    marginTop: 2,
  },
  amountTotalLabel: { fontSize: 14, color: "#ffffff", fontWeight: "700" },
  amountTotalValue: { fontSize: 14, color: "#86efac", fontWeight: "700" },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  pkpBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pkpBadgeText: { fontSize: 11, color: "#92400e", fontWeight: "700" },
  poGroup: { fontSize: 12, color: "#a5b4fc" },
  companyBadge: {
    backgroundColor: "rgba(99,102,241,0.3)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  companyBadgeText: { fontSize: 11, color: "#c7d2fe", fontWeight: "600" },
  fieldGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 8 },
  required: { color: "#dc2626" },
  fieldHint: { fontSize: 11, color: "#9ca3af", marginTop: 4 },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111827",
  },
  inputPrefix: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    overflow: "hidden",
  },
  prefixText: {
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#6b7280",
    fontWeight: "600",
    borderRightWidth: 1,
    borderRightColor: "#e2e8f0",
    paddingVertical: 14,
  },
  inputWithPrefix: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111827",
  },
  selectBtn: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectBtnText: { fontSize: 15, color: "#111827", flex: 1 },
  selectPlaceholder: { color: "#9ca3af" },
  selectArrow: { fontSize: 12, color: "#6b7280" },
  dropdownList: {
    marginTop: 4,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  dropdownItemActive: { backgroundColor: "#eef2ff" },
  dropdownItemText: { fontSize: 14, color: "#374151", flex: 1 },
  dropdownItemTextActive: { color: "#6366f1", fontWeight: "600" },
  stageYear: { fontSize: 12, color: "#9ca3af" },
  infoBox: {
    backgroundColor: "#eff6ff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    padding: 14,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1d4ed8",
    marginBottom: 8,
  },
  infoItem: { fontSize: 13, color: "#1e40af", marginBottom: 4 },
  submitBtn: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
});
