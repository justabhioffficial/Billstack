import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Shield, CreditCard, Bell } from 'lucide-react-native';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <User size={32} color="#2563EB" />
        </View>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Plan: {user?.plan || 'FREE'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.row}>
          <CreditCard size={20} color="#475569" />
          <Text style={styles.rowText}>Subscription & Plan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Bell size={20} color="#475569" />
          <Text style={styles.rowText}>Notification Preferences</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Shield size={20} color="#475569" />
          <Text style={styles.rowText}>Security & Privacy</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <LogOut size={18} color="#EF4444" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 32 },
  profileHeader: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  name: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  email: { fontSize: 12, color: '#64748B', marginTop: 2, marginBottom: 10 },
  badge: { backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#BFDBFE' },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#1D4ED8' },
  section: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden', marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  rowText: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginLeft: 8 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FEF2F2', paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#FCA5A5' },
  logoutText: { color: '#EF4444', fontSize: 14, fontWeight: '700', marginLeft: 6 }
});
