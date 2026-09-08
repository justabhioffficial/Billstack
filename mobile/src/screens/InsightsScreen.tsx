import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { intelligenceApi, vendorApi } from '../services/api';
import { MonthlyIntelligence, VendorAnalytics, ExpenseHealth } from '../types';
import { PieChart, Store, ShieldCheck } from 'lucide-react-native';

export const InsightsScreen: React.FC = () => {
  const [intel, setIntel] = useState<MonthlyIntelligence | null>(null);
  const [vendors, setVendors] = useState<VendorAnalytics[]>([]);
  const [health, setHealth] = useState<ExpenseHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      intelligenceApi.getMonthlyIntelligence(),
      vendorApi.getVendorAnalytics(),
      intelligenceApi.getExpenseHealth(),
    ]).then(([intelRes, vendorRes, healthRes]) => {
      if (intelRes.data.success) setIntel(intelRes.data.data);
      if (vendorRes.data.success) setVendors(vendorRes.data.data.slice(0, 5));
      if (healthRes.data.success) setHealth(healthRes.data.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Expense Intelligence</Text>

      {/* Health Score Box */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <ShieldCheck size={20} color="#059669" />
          <Text style={styles.cardTitle}>Expense Health Score</Text>
        </View>
        <Text style={styles.scoreText}>{health?.score || 100} / 100</Text>
        <Text style={styles.subText}>{health?.healthGrade || 'EXCELLENT'} • {health?.categorizedCount || 0} of {health?.totalCount || 0} categorized</Text>
      </View>

      {/* Spending Breakdown */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <PieChart size={20} color="#2563EB" />
          <Text style={styles.cardTitle}>Monthly Metrics</Text>
        </View>
        <Text style={styles.metricLabel}>Average Receipt Amount: ₹{intel?.averageReceiptAmount || 0}</Text>
        <Text style={styles.metricLabel}>Largest Transaction: ₹{intel?.maxReceiptAmount || 0}</Text>
        <Text style={styles.metricLabel}>MoM Change: {intel?.momChangePercentage || 0}%</Text>
      </View>

      {/* Top Vendors */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Store size={20} color="#7C3AED" />
          <Text style={styles.cardTitle}>Top Vendors</Text>
        </View>
        {vendors.map((v, i) => (
          <View key={i} style={styles.vendorRow}>
            <Text style={styles.vendorName}>{v.vendorName}</Text>
            <Text style={styles.vendorSpent}>₹{v.totalSpent}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginLeft: 6 },
  scoreText: { fontSize: 28, fontWeight: '800', color: '#059669' },
  subText: { fontSize: 12, color: '#64748B', marginTop: 4 },
  metricLabel: { fontSize: 13, color: '#334155', marginBottom: 6 },
  vendorRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  vendorName: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  vendorSpent: { fontSize: 13, fontWeight: '700', color: '#2563EB' },
});
