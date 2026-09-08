import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { receiptApi, categoryApi } from '../services/api';
import { Receipt, Category } from '../types';
import { Search, Filter, Receipt as ReceiptIcon, ChevronRight } from 'lucide-react-native';

export const ReceiptsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReceipts = async () => {
    try {
      const params: Record<string, any> = { page: 0, size: 20 };
      if (search) params.search = search;

      const res = await receiptApi.getReceipts(params);
      if (res.data.success) {
        setReceipts(res.data.data.content);
      }
    } catch (ignored) {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleSearchSubmit = () => {
    setLoading(true);
    fetchReceipts();
  };

  const renderItem = ({ item }: { item: Receipt }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ReceiptDetails', { receiptId: item.id })}
    >
      <View style={styles.iconContainer}>
        <ReceiptIcon size={22} color="#3B82F6" />
      </View>
      <View style={styles.cardMain}>
        <Text style={styles.vendorName} numberOfLines={1}>
          {item.vendorName || item.originalFilename}
        </Text>
        <Text style={styles.subText}>{item.receiptDate || 'N/A'} • {item.categoryName || 'General'}</Text>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.amountText}>₹{item.totalAmount || 0}</Text>
        <ChevronRight size={16} color="#94A3B8" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchBar}>
        <Search size={18} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search vendor, amount, invoice..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearchSubmit}
        />
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={receipts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchReceipts(); }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No receipts found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', margin: 16, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', height: 44 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, color: '#0F172A' },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  iconContainer: { width: 42, height: 42, borderRadius: 10, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardMain: { flex: 1 },
  vendorName: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  subText: { fontSize: 11, color: '#64748B', marginTop: 2 },
  cardRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  amountText: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginRight: 4 },
  emptyContainer: { padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 13, color: '#64748B' }
});
