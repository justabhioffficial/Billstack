import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { receiptApi, categoryApi } from '../services/api';
import { Receipt, Category } from '../types';
import { Check, Trash2, ArrowLeft } from 'lucide-react-native';

export const ReceiptDetailsScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { receiptId } = route.params || {};
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [vendorName, setVendorName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [taxAmount, setTaxAmount] = useState('');
  const [receiptDate, setReceiptDate] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (receiptId) {
      receiptApi.getReceiptById(receiptId).then((res) => {
        if (res.data.success) {
          const r = res.data.data;
          setReceipt(r);
          setVendorName(r.vendorName || '');
          setTotalAmount(r.totalAmount ? r.totalAmount.toString() : '');
          setTaxAmount(r.taxAmount ? r.taxAmount.toString() : '');
          setReceiptDate(r.receiptDate || '');
          setReceiptNumber(r.receiptNumber || '');
        }
        setLoading(false);
      });
    }
  }, [receiptId]);

  const handleSave = async () => {
    if (!receiptId) return;

    setSaving(true);
    try {
      const res = await receiptApi.updateReceipt(receiptId, {
        vendorName,
        totalAmount: parseFloat(totalAmount) || 0,
        taxAmount: parseFloat(taxAmount) || 0,
        receiptDate,
        receiptNumber,
      });

      if (res.data.success) {
        Alert.alert('Saved', 'Receipt details updated successfully.');
        navigation.goBack();
      }
    } catch (e) {
      Alert.alert('Error', 'Unable to update receipt.');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!receiptId) return;

    Alert.alert('Confirm Delete', 'Are you sure you want to delete this receipt?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await receiptApi.deleteReceipt(receiptId);
            navigation.goBack();
          } catch (e) {
            Alert.alert('Error', 'Unable to delete receipt.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receipt Details</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Trash2 size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>Vendor Name</Text>
        <TextInput style={styles.input} value={vendorName} onChangeText={setVendorName} placeholder="Vendor name" />

        <Text style={styles.label}>Total Amount (₹)</Text>
        <TextInput style={styles.input} value={totalAmount} onChangeText={setTotalAmount} keyboardType="numeric" placeholder="0.00" />

        <Text style={styles.label}>Tax / GST (₹)</Text>
        <TextInput style={styles.input} value={taxAmount} onChangeText={setTaxAmount} keyboardType="numeric" placeholder="0.00" />

        <Text style={styles.label}>Receipt Date (YYYY-MM-DD)</Text>
        <TextInput style={styles.input} value={receiptDate} onChangeText={setReceiptDate} placeholder="2026-09-08" />

        <Text style={styles.label}>Receipt / Invoice #</Text>
        <TextInput style={styles.input} value={receiptNumber} onChangeText={setReceiptNumber} placeholder="Invoice #" />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  deleteBtn: { padding: 8 },
  formCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0' },
  label: { fontSize: 11, fontWeight: '600', color: '#64748B', marginTop: 12, marginBottom: 4 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#0F172A' },
  saveBtn: { backgroundColor: '#2563EB', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  saveBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
