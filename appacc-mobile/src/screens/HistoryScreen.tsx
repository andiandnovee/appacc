import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getReceipts } from '../api/receipt';
import { ReceiptItem } from '../types';

export default function HistoryScreen() {
  const navigation = useNavigation<any>();
  const [receipts, setReceipts] = useState<ReceiptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadReceipts(1, true);
  }, []);

  const loadReceipts = async (pageNum: number, reset = false) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await getReceipts(pageNum);
      const data = response.data ?? [];
      const lastPage = response.meta?.last_page ?? 1;

      if (reset) setReceipts(data);
      else setReceipts(prev => [...prev, ...data]);

      setHasMore(pageNum < lastPage);
      setPage(pageNum);
    } catch (error: any) {
      Alert.alert('Gagal', 'Tidak dapat memuat data receipt');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadReceipts(1, true);
  }, []);

  const onLoadMore = () => {
    if (!loadingMore && hasMore) loadReceipts(page + 1);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  const renderItem = ({ item }: { item: ReceiptItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.poNumber}>{item.po_number ?? '-'}</Text>
          {item.invoice_number ? (
            <Text style={styles.invoiceNumber}>Inv: {item.invoice_number}</Text>
          ) : null}
        </View>
        <Text style={styles.tanggal}>{formatDate(item.receipt_date)}</Text>
      </View>

      <Text style={styles.vendorName}>{item.vendor?.name ?? '-'}</Text>

      <View style={styles.cardFooter}>
        <Text style={styles.amount}>
          Rp {Number(item.amount).toLocaleString('id-ID')}
        </Text>
        {item.stage && (
          <View style={styles.stageBadge}>
            <Text style={styles.stageBadgeText}>
              {item.stage.name} {item.stage.year}
            </Text>
          </View>
        )}
      </View>

      {item.latest_status && (
        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{item.latest_status.status_value}</Text>
        </View>
      )}

      <Text style={styles.createdAt}>Diinput: {formatDate(item.created_at)}</Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>Belum ada receipt</Text>
      <Text style={styles.emptyDesc}>Receipt yang diinput akan muncul di sini</Text>
      <TouchableOpacity style={styles.scanBtn} onPress={() => navigation.navigate('ScanPO')}>
        <Text style={styles.scanBtnText}>Scan PO Sekarang</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => !loadingMore ? null : (
    <View style={styles.footerLoader}>
      <ActivityIndicator size="small" color="#6366f1" />
      <Text style={styles.footerText}>Memuat lebih banyak...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat Receipt</Text>
        <View style={{ width: 80 }} />
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      ) : (
        <FlatList
          data={receipts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.3}
          contentContainerStyle={[
            styles.listContent,
            receipts.length === 0 && styles.listContentEmpty,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#6366f1']}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
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
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#6b7280' },
  listContent: { padding: 16 },
  listContentEmpty: { flex: 1 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  headerLeft: { flex: 1 },
  poNumber: { fontSize: 15, fontWeight: '700', color: '#1e1b4b' },
  invoiceNumber: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  tanggal: { fontSize: 12, color: '#6b7280' },
  vendorName: { fontSize: 13, color: '#374151', marginBottom: 10 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amount: { fontSize: 15, fontWeight: '700', color: '#059669' },
  stageBadge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stageBadgeText: { fontSize: 12, color: '#6366f1', fontWeight: '600' },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6366f1',
  },
  statusText: { fontSize: 12, color: '#6b7280' },
  createdAt: { fontSize: 11, color: '#9ca3af' },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1e1b4b', marginBottom: 8 },
  emptyDesc: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  scanBtn: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  scanBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  footerText: { fontSize: 13, color: '#6b7280' },
});
