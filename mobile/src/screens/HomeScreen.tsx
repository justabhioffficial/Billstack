import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { intelligenceApi, receiptApi } from '../services/api';
import { MonthlyIntelligence, Receipt } from '../types';
import { Camera, Receipt as ReceiptIcon, TrendingUp, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react-native';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [intel, setIntel] = useState<MonthlyIntelligence | null>(null);
  const [recentReceipts, setRecentReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [intelRes, receiptsRes] = await Promise.all([
        intelligenceApi.getMonthlyIntelligence(),
        receiptApi.getReceipts({ page: 0, size: 5 })
      ]);

      if (intelRes.data.success) {
        setIntel(intelRes.data.data);
      }
      if (receiptsRes.data.success) {
        setRecentReceipts(receiptsRes.data.data.content);
      }
    } catch (ignored) {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header Greeting */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'Professional'}</Text>
        </View>
        <View style={styles.planBadge}>
          <Text style={styles.planBadgeText}>{user?.plan || 'FREE'}</Text>
        </View>
      </View>

      {/* Primary Action Button: Scan Receipt */}
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigation.navigate('Capture')}
        activeOpacity={0.85}
      >
        <Camera size={24} color="#FFFFFF" />
        <Text style={styles.scanButtonText}>Scan & Upload Receipt</Text>
      </TouchableOpacity>

      {/* Monthly Expense Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>THIS MONTH ({intel?.month || 'Current'})</Text>
        
        <View style={styles.metricsRow}>
          <View style={styles.metricCol}>
            <Text style={styles.metricLabel}>Total Spent</Text>
            <Text style={styles.metricValue}>₹{intel?.totalSpent || 0}</Text>
          </View>
          <View style={styles.metricCol}>
            <Text style={styles.metricLabel}>Receipts</Text>
            <Text style={styles.metricValue}>{intel?.receiptCount || 0}</Text>
          </View>
          <View style={styles.metricCol}>
            <Text style={styles.metricLabel}>Org Score</Text>
            <Text style={[styles.metricValue, { color: '#059669' }]}>{intel?.organizationScore || 100}%</Text>
          </View>
        </View>

        {intel?.estimatedTimeSavedMinutes ? (
          <View style={styles.timeSavedRow}>
            <CheckCircle2 size={14} color="#2563EB" />
            <Text style={styles.timeSavedText}>
              Estimated {intel.estimatedTimeSavedMinutes} mins saved on manual entry
            </Text>
          </View>
        ) : null}
      </View>

      {/* Quick Action Navigation */}
      <View style={styles.quickNavRow}>
        <TouchableOpacity
          style={styles.quickNavCard}
          onPress={() => navigation.navigate('Insights')}
        >
          <TrendingUp size={20} color="#2563EB" />
          <Text style={styles.quickNavText}>Insights</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickNavCard}
          onPress={() => navigation.navigate('Ask')}
        >
          <Sparkles size={20} color="#7C3AED" />
          <Text style={styles.quickNavText}>Ask AI</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Receipts List Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Receipts</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Receipts')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentReceipts.length > 0 ? (
          recentReceipts.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={styles.receiptRow}
              onPress={() => navigation.navigate('ReceiptDetails', { receiptId: r.id })}
            >
              <View style={styles.receiptIconBox}>
                <ReceiptIcon size={20} color="#475569" />
              </View>
              <View style={styles.receiptMain}>
                <Text style={styles.vendorName} numberOfLines={1}>
                  {r.vendorName || r.originalFilename}
                </Text>
                <Text style={styles.receiptDate}>{r.receiptDate || 'Pending'}</Text>
              </View>
              <View style={styles.receiptRight}>
                <Text style={styles.amountText}>₹{r.totalAmount || 0}</Text>
                <Text
                  style={[
                    styles.statusBadge,
                    r.ocrStatus === 'COMPLETED' ? styles.statusCompleted : styles.statusReview
                  ]}
                >
                  {r.ocrStatus}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <AlertCircle size={24} color="#94A3B8" />
            <Text style={styles.emptyText}>No receipts recorded this month.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greeting: { fontSize: 13, color: '#64748B' },
  userName: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  planBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#BFDBFE' },
  planBadgeText: { fontSize: 11, fontWeight: '700', color: '#1D4ED8' },
  scanButton: { backgroundColor: '#2563EB', flexDirection: 'row', alignItems: 'center', justify: 'center', paddingVertical: 14, borderRadius: 12, gap: 10, marginBottom: 16, shadowColor: '#2563EB', shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  scanButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', marginLeft: 8 },
  summaryCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  summaryTitle: { fontSize: 10, fontWeight: '700', color: '#64748B', tracking: 1, marginBottom: 12 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metricCol: { flex: 1, alignItems: 'flex-start' },
  metricLabel: { fontSize: 11, color: '#64748B', marginBottom: 2 },
  metricValue: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  timeSavedRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  timeSavedText: { fontSize: 11, color: '#475569', marginLeft: 4 },
  quickNavRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  quickNavCard: { flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  quickNavText: { fontSize: 13, fontWeight: '600', color: '#1E293B', marginLeft: 6 },
  section: { marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justify: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  seeAllText: { fontSize: 12, fontWeight: '600', color: '#2563EB' },
  receiptRow: { backgroundColor: '#FFFFFF', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  receiptIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  receiptMain: { flex: 1 },
  vendorName: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  receiptDate: { fontSize: 11, color: '#64748B', marginTop: 2 },
  receiptRight: { alignItems: 'flex-end' },
  amountText: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  statusBadge: { fontSize: 9, fontWeight: '700', marginTop: 2, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusCompleted: { backgroundColor: '#ECFDF5', color: '#047857' },
  statusReview: { backgroundColor: '#FEF3C7', color: '#B45309' },
  emptyCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  emptyText: { fontSize: 12, color: '#64748B', marginTop: 8 }
});
